<?php
declare(strict_types=1);

/**
 * track.php
 *
 * 이 엔드포인트는 실제 송장 번호 조회를 담당한다.
 *
 * 프런트엔드에서 POST JSON 형태로 다음을 보낸다고 가정한다.
 * {
 *   "carrierId": "kr.cjlogistics",  // carriers.php 응답에서 선택한 id
 *   "carrierName": "CJ Logistics",  // 사용자가 보기 쉬운 이름(옵션)
 *   "trackingNumber": "1234567890"  // 조회할 송장 번호
 * }
 *
 * 이 정보를 바탕으로 Delivery Tracker GraphQL `track` 쿼리를 호출한다.
 * track(carrierId: ID!, trackingNumber: String!) {
 *   trackingNumber
 *   lastEvent { ... }
 *   events(last: 20) { edges { node { ... } } }
 *   sender { ... }
 *   recipient { ... }
 * }
 *
 * 받은 데이터를 프런트엔드에서 바로 쓸 수 있도록 가공한다.
 * 특히 progress 배열을 생성한다.
 */

require_once __DIR__ . '/bootstrap.php';

// 1. 요청 Body(JSON) 파싱
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    send_json(
        [
            'ok' => false,
            'error' => '잘못된 요청 형식입니다. JSON Body가 필요합니다.',
        ],
        400
    );
}

$carrierId = trim($data['carrierId'] ?? '');
$carrierName = trim($data['carrierName'] ?? '');
$trackingNumber = trim($data['trackingNumber'] ?? '');

if ($carrierId === '' || $trackingNumber === '') {
    send_json(
        [
            'ok' => false,
            'error' => 'carrierId와 trackingNumber는 필수입니다.',
        ],
        400
    );
}

// 2. Delivery Tracker GraphQL 쿼리 정의
//    track 쿼리는 특정 운송장(trackInfo)을 반환한다.
//    events(...) 를 통해 최근 이벤트 목록을 가져온다.
$query = <<<'GQL'
query TrackQuery($carrierId: ID!, $trackingNumber: String!) {
  track(carrierId: $carrierId, trackingNumber: $trackingNumber) {
    trackingNumber
    lastEvent {
      time
      status {
        code
        name
      }
      location {
        name
        countryCode
        postalCode
      }
      description
    }
    events(last: 20) {
      edges {
        node {
          time
          status {
            code
            name
          }
          location {
            name
            countryCode
            postalCode
          }
          description
        }
      }
    }
    sender {
      name
      location {
        name
        countryCode
        postalCode
      }
      phoneNumber
    }
    recipient {
      name
      location {
        name
        countryCode
        postalCode
      }
      phoneNumber
    }
  }
}
GQL;

$variables = [
    'carrierId' => $carrierId,
    'trackingNumber' => $trackingNumber,
];

// 3. Delivery Tracker 호출
$trackRes = call_delivery_tracker($query, $variables);

if (!$trackRes['ok']) {
    // Delivery Tracker 호출 오류 시 그대로 반환
    send_json($trackRes, 500);
}

$trackInfo = $trackRes['data']['track'] ?? null;

if ($trackInfo === null) {
    // 운송장 정보를 전혀 찾지 못한 경우
    send_json(
        [
            'ok' => false,
            'error' => '조회된 운송장 정보가 없습니다.',
        ],
        404
    );
}

// 4. events -> progress 배열 가공
//    progress 는 프런트엔드에서
//    - 상단 진행 바에 표시 (각 단계의 step과 done 여부)
//    - 하단 상세 이력에 표시 (reverse()하여 최근 순으로 노출)
//    형식을 따른다.
//
//    Delivery Tracker의 events 는 오래된 이벤트부터 최신 이벤트 순으로 정렬되어 있다고 가정한다.
//    각 이벤트마다 time, description/status, location을 추출한다.
//    모든 실제 발생 이벤트는 done=true 로 둔다.
//    마지막이 "DELIVERED" 가 아니면, 가상의 "배송 완료" 단계를 done=false 로 추가한다.

$events = $trackInfo['events']['edges'] ?? [];
$progress = [];

foreach ($events as $edge) {
    $node = $edge['node'] ?? [];

    // 원본 ISO 시간 문자열
    $rawTime = $node['time'] ?? '';
    $formattedTime = '';

    if ($rawTime !== '') {
        try {
            // ISO8601 형식을 DateTime으로 파싱한다.
            $dt = new DateTime($rawTime);
            // 한국 시간대(Asia/Seoul) 기준으로 맞춘다.
            $dt->setTimezone(new DateTimeZone('Asia/Seoul'));
            // "MM.DD HH:mm" 형태로 사람이 읽기 쉬운 형식으로 변환한다.
            $formattedTime = $dt->format('m.d H:i');
        } catch (Exception $e) {
            // 파싱 실패 시 원문 그대로 사용한다.
            $formattedTime = $rawTime;
        }
    }

    // 상태 텍스트는 description 우선, description 없으면 status.name,
    // 그것도 없으면 status.code 를 사용한다.
    $statusName = $node['status']['name'] ?? '';
    $statusCode = $node['status']['code'] ?? '';
    $desc = $node['description'] ?? '';
    $stepText = $desc !== '' ? $desc : ($statusName !== '' ? $statusName : $statusCode);

    // 위치 문자열
    $locationText = $node['location']['name'] ?? '';

    $progress[] = [
        'step' => $stepText,
        'time' => $formattedTime,
        'location' => $locationText,
        'done' => true,
    ];
}

// 5. 상단에 크게 보여줄 전체 상태 문자열 계산
//    Delivery Tracker의 lastEvent.status.code 를 참조하여,
//    사람이 이해하기 쉬운 한글 상태를 만든다.
//    대표 예:
//      DELIVERED         -> 배송 완료
//      OUT_FOR_DELIVERY  -> 배송 출발
//      IN_TRANSIT        -> 배송 중
//      AT_PICKUP, INFORMATION_RECEIVED -> 집화/접수
//      AVAILABLE_FOR_PICKUP           -> 픽업 대기
//      ATTEMPT_FAIL                   -> 배송 실패
//      EXCEPTION                      -> 이상 발생
$lastEvent = $trackInfo['lastEvent'] ?? [];
$lastCode = $lastEvent['status']['code'] ?? '';
$overallStatus = match ($lastCode) {
    'DELIVERED' => '배송 완료',
    'OUT_FOR_DELIVERY' => '배송 출발',
    'IN_TRANSIT' => '배송 중',
    'AT_PICKUP', 'INFORMATION_RECEIVED' => '집화/접수',
    'AVAILABLE_FOR_PICKUP' => '픽업 대기',
    'ATTEMPT_FAIL' => '배송 실패',
    'EXCEPTION' => '이상 발생',
    default => ($lastEvent['status']['name']
        ?? ($lastEvent['description'] ?? $lastCode)),
};

// 배송이 아직 완료되지 않았다면, 마지막에 가상의 "배송 완료" 단계를 추가한다.
// 이 단계는 done=false 로 두어 아직 완료 전임을 시각적으로 표현한다.
if ($lastCode !== 'DELIVERED') {
    $progress[] = [
        'step' => '배송 완료',
        'time' => '',
        'location' => '',
        'done' => false,
    ];
}

// 6. 프런트엔드가 그대로 사용할 result 형태 구성
$responseData = [
    'trackingNumber' => $trackInfo['trackingNumber'] ?? $trackingNumber,
    'carrierId' => $carrierId,
    'carrierName' => $carrierName,
    'status' => $overallStatus,
    'progress' => $progress,
];

// 7. JSON 응답 전송
send_json([
    'ok' => true,
    'data' => $responseData,
]);
