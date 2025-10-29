<?php
declare(strict_types=1);

/**
 * carriers.php
 *
 * 이 엔드포인트는 프런트엔드가 페이지 접속 시(또는 새로고침 시)
 * 택배사 선택 드롭다운을 채우기 위해 호출한다.
 *
 * 동작 과정은 다음과 같다.
 * 1. bootstrap.php 를 불러 공통 초기화(.env 로드, call_delivery_tracker 등)를 준비한다.
 * 2. Delivery Tracker GraphQL `carriers` 쿼리를 호출한다.
 *    carriers(first: Int, countryCode: String) {
 *      edges {
 *        node { id name }
 *      }
 *    }
 * 3. id / name 만 깔끔하게 골라서 JSON으로 반환한다.
 */

require_once __DIR__ . '/bootstrap.php';

/* Delivery Tracker에 전송할 GraphQL 쿼리 문자열
 * - $first 로 최대 몇 개까지 가져올지
 * - $countryCode 로 국가 코드 힌트를 준다 (예: "KR")
 */
$query = <<<'GQL'
query CarrierList($first: Int, $countryCode: String) {
  carriers(first: $first, countryCode: $countryCode) {
    edges {
      node {
        id
        name
      }
    }
  }
}
GQL;

$variables = [
    'first' => 50,
    'countryCode' => 'KR',
];

// Delivery Tracker 호출
$res = call_delivery_tracker($query, $variables);

if (!$res['ok']) {
    // Delivery Tracker 호출 실패 또는 GraphQL 에러 등
    send_json($res, 500);
}

// carriers 결과 파싱
$edges = $res['data']['carriers']['edges'] ?? [];
$list = [];

foreach ($edges as $edge) {
    $node = $edge['node'] ?? [];
    if (isset($node['id'], $node['name'])) {
        $list[] = [
            'id' => $node['id'],
            'name' => $node['name'],
        ];
    }
}

// 프런트엔드에서 사용할 응답 형식
send_json([
    'ok' => true,
    'data' => $list,
]);
