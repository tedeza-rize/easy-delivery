<?php
declare(strict_types=1);

/**
 * bootstrap.php
 *
 * 이 파일은 공통 초기화를 담당한다.
 * 주요 역할은 다음과 같다.
 *
 * 1. CORS(교차 출처 요청) 헤더 처리 및 OPTIONS 프리플라이트 요청에 대한 조기 응답
 * 2. .env 파일을 직접 파싱하여 민감 정보를 $_ENV 에 주입
 *    (외부 라이브러리 없이 직접 구현)
 * 3. Delivery Tracker GraphQL API 호출 함수 제공
 * 4. JSON 응답 전송용 send_json 함수 제공
 *
 * 이 파일은 carriers.php, track.php 등 다른 엔드포인트에서
 * require_once 로 불러 사용한다.
 */


/* -------------------------------------------------
 * 1. CORS 처리
 *    브라우저가 Preflight(OPTIONS) 요청을 보낼 수 있으므로
 *    OPTIONS 요청이면 여기서 바로 종료한다.
 *    실제 서비스에서는 도메인 제한 등 보안 정책에 맞추어야 한다.
 * ------------------------------------------------- */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    exit;
}


/* -------------------------------------------------
 * 2. .env 로더 (외부 라이브러리 없이 직접 구현)
 *
 *    이 함수는 지정한 경로의 .env 파일을 읽고,
 *    각 행을 "KEY=VALUE" 형태로 파싱하여 $_ENV["KEY"] 에 저장한다.
 *
 *    동작 방식:
 *    - 파일이 없으면 아무 것도 하지 않는다 (필수 항목은 나중에 검사).
 *    - 주석(# 또는 ;)으로 시작하는 줄은 무시한다.
 *    - 빈 줄은 무시한다.
 *    - KEY=VALUE 에서 KEY는 왼쪽, VALUE는 오른쪽 전체를 사용한다.
 *    - VALUE 둘레에 따옴표(" 또는 ')가 있으면 제거한다.
 *    - trim() 을 통해 앞뒤 공백 제거.
 *
 *    보안 주의:
 *    - 실제 서비스에서는 .env 파일 접근 권한(서버 퍼미션)을 매우 제한해야 한다.
 *    - .env 파일의 내용을 외부로 그대로 노출해서는 안 된다.
 * ------------------------------------------------- */
function load_env_file(string $envPath): void {
    if (!is_file($envPath)) {
        // .env 파일이 존재하지 않으면 조용히 리턴한다.
        return;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    if ($lines === false) {
        // 파일을 읽을 수 없는 경우에도 강하게 중단하지는 않고 리턴한다.
        return;
    }

    foreach ($lines as $line) {
        // 주석 줄(# 또는 ;)이면 무시한다.
        $trimmed = trim($line);
        if ($trimmed === '' || $trimmed[0] === '#' || $trimmed[0] === ';') {
            continue;
        }

        // KEY=VALUE 형태 파싱
        $eqPos = strpos($trimmed, '=');
        if ($eqPos === false) {
            // '=' 가 없는 줄은 무시한다.
            continue;
        }

        $key = trim(substr($trimmed, 0, $eqPos));
        $value = trim(substr($trimmed, $eqPos + 1));

        // 작은따옴표 또는 큰따옴표로 감싸져 있는 경우 제거한다.
        if (
            (str_starts_with($value, '"') && str_ends_with($value, '"')) ||
            (str_starts_with($value, "'") && str_ends_with($value, "'"))
        ) {
            $value = substr($value, 1, -1);
        }

        // PHP 전역 환경 변수 저장
        // $_ENV 는 PHP 스크립트 전역에서 사용할 수 있다.
        $_ENV[$key] = $value;

        // putenv 로 OS 환경에도 반영할 수 있다.
        // 필요 시 주석 해제 가능:
        // putenv($key . '=' . $value);
    }
}

/**
 * 문자열이 어떤 접두사/접미사로 시작/끝나는지 확인하는 간단한 헬퍼
 * PHP 8.0 이상에서 str_starts_with / str_ends_with 는 내장되어 있으므로
 * 서버가 PHP 8.0 이상이라면 위의 사용은 문제가 없다.
 * 만약 PHP 7.x 계열이라면 아래와 같은 대체 함수를 직접 정의해야 한다.
 * 여기서는 PHP 8 이상을 가정한다.
 */


/* -------------------------------------------------
 * 3. .env 파일 로드 실행
 *    ./.env 경로를 기준으로 한다고 가정한다.
 * ------------------------------------------------- */
load_env_file(__DIR__ . '/.env');


/* -------------------------------------------------
 * 4. JSON 응답 헬퍼
 *
 *    send_json($payload, $statusCode)
 *    - JSON 헤더 세팅
 *    - HTTP 상태 코드 설정
 *    - 연관 배열을 JSON으로 인코딩하여 출력 후 종료
 * ------------------------------------------------- */
function send_json(array $payload, int $statusCode = 200): void {
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}


/* -------------------------------------------------
 * 5. Delivery Tracker GraphQL 호출 함수
 *
 *    Delivery Tracker API는 GraphQL over HTTP 형태이다.
 *    - 엔드포인트: POST https://apis.tracker.delivery/graphql
 *    - 헤더:
 *        Content-Type: application/json
 *        Authorization: TRACKQL-API-KEY {CLIENT_ID}:{CLIENT_SECRET}
 *    - Body:
 *        {"query":"...","variables":{...}}
 *
 *    이 함수는 위 형식으로 cURL 요청을 보내고,
 *    결과를 배열 형태로 반환한다.
 *
 *    반환 형식:
 *    성공 시:
 *    [
 *      'ok'   => true,
 *      'data' => (GraphQL data 필드)
 *    ]
 *
 *    실패 시:
 *    [
 *      'ok'    => false,
 *      'error' => '에러 메시지',
 *      ... (추가 디버깅 정보)
 *    ]
 *
 *    주의:
 *    - TRACKER_CLIENT_ID, TRACKER_CLIENT_SECRET 값이 없으면
 *      정상 동작할 수 없으므로 에러를 반환한다.
 * ------------------------------------------------- */
function call_delivery_tracker(string $query, array $variables = []): array {
    // .env 에서 로드된 민감 정보
    $clientId = $_ENV['TRACKER_CLIENT_ID'] ?? '';
    $clientSecret = $_ENV['TRACKER_CLIENT_SECRET'] ?? '';

    if ($clientId === '' || $clientSecret === '') {
        return [
            'ok' => false,
            'error' => '서버 인증 정보(.env TRACKER_CLIENT_ID / TRACKER_CLIENT_SECRET)가 설정되지 않았습니다.',
        ];
    }

    // GraphQL 요청 페이로드
    $payload = [
        'query' => $query,
        'variables' => $variables,
    ];

    // cURL 초기화
    $ch = curl_init('https://apis.tracker.delivery/graphql');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            "Authorization: TRACKQL-API-KEY {$clientId}:{$clientSecret}",
        ],
        CURLOPT_POSTFIELDS => json_encode(
            $payload,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        ),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
    ]);

    $responseBody = curl_exec($ch);

    if ($responseBody === false) {
        $err = curl_error($ch);
        curl_close($ch);

        return [
            'ok' => false,
            'error' => "cURL 오류: {$err}",
        ];
    }

    curl_close($ch);

    $decoded = json_decode($responseBody, true);

    if (!is_array($decoded)) {
        // JSON 파싱 실패
        return [
            'ok' => false,
            'error' => 'Delivery Tracker 응답 파싱 실패',
            'raw'  => $responseBody,
        ];
    }

    // GraphQL 에러 규약에 따라 errors 필드가 있을 수 있다.
    if (isset($decoded['errors']) && is_array($decoded['errors']) && count($decoded['errors']) > 0) {
        return [
            'ok' => false,
            'error' => 'Delivery Tracker GraphQL 오류: ' . ($decoded['errors'][0]['message'] ?? '알 수 없는 오류'),
            'graphQLErrors' => $decoded['errors'],
        ];
    }

    // 정상 데이터
    return [
        'ok'   => true,
        'data' => $decoded['data'] ?? null,
    ];
}
