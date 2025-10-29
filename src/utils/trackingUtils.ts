/**
 * CARRIER_NAME_MAP
 * 특정 택배사 ID에 대해 사용자가 보기 좋은 한국어(또는 보편적으로 쓰이는 명칭)로 치환한다.
 * 전달받은 carrierId가 이 맵에 존재하지 않으면 서버에서 내려온 원본 이름(fallbackName)을 그대로 사용한다.
 */
const CARRIER_NAME_MAP: Record<string, string> = {
  'cn.cainiao.global': '카이니아오 글로벌',
  'de.dhl': 'DHL',
  'jp.sagawa': '사가와',
  'jp.yamato': '야마토',
  'kr.actcore.ocean-inbound': 'ACT&CORE (해상 수입)',
  'kr.cjlogistics': 'CJ대한통운',
  'kr.coupangls': '쿠팡로지스틱스서비스',
  'kr.cupost': 'CU편의점택배',
  'kr.chunilps': '천일택배',
  'kr.cvsnet': 'GS Postbox',
  'kr.cway': '우리익스프레스(CWAY)',
  'kr.daesin': '대신택배',
  'kr.epantos': 'LX판토스',
  'kr.epost': '우체국택배',
  'kr.epost.ems': '우체국 EMS',
  'kr.goodstoluck': '굿스트럭',
  'kr.homepick': '홈픽',
  'kr.hanjin': '한진택배',
  'kr.honamlogis': '호남로지스',
  'kr.ilyanglogis': '일양로지스',
};

/**
 * getCarrierDisplayName
 * - carrierId를 맵에서 찾아서 치환 이름을 돌려준다.
 * - 맵에 없을 경우 fallbackName(서버에서 내려온 원래 이름)을 그대로 쓴다.
 *
 * @param id          택배사 ID (예: "kr.cjlogistics")
 * @param fallbackName 서버 응답의 carrier.name 등 원본 이름
 * @returns 화면에 표시할 최종 이름
 */
export function getCarrierDisplayName(id: string, fallbackName: string): string {
  return CARRIER_NAME_MAP[id] || fallbackName || id;
}

/**
 * summarizeStatus
 * - 배송 단계/상태 문장이 너무 길 경우 상단 진행 바나 상단 상태 영역에서는
 *   "인수", "이동 중", "배송 예정", "배송 완료" 등 짧은 요약어로 치환한다.
 *
 * 이 함수는 다음 시나리오를 처리한다.
 * 예:
 *  - "보내시는 고객님으로부터 상품을 인수받았습니다" -> "인수"
 *  - "물류터미널로 상품이 이동중입니다." -> "이동 중"
 *  - "고객님의 상품이 배송지에 도착하였습니다.(...)" -> "배송지 도착"
 *  - "고객님의 상품을 배송할 예정입니다.(13~15시)..." -> "배송 예정"
 *  - "고객님의 상품이 배송완료 되었습니다.(...)" -> "배송 완료"
 *
 * @param raw 원본 상태 문자열
 * @returns 짧게 요약된 상태 문자열
 */
export function summarizeStatus(raw: string): string {
  const s = raw || '';

  // 배송 완료 관련 문구
  if (s.includes('배송완료') || s.includes('배송 완료')) {
    return '배송 완료';
  }

  // 배송 예정(곧 배달할 예정 등)
  if (s.includes('배송할 예정') || s.includes('배송 예정')) {
    return '배송 예정';
  }

  // 배송지 도착(지역 도착)
  if (s.includes('배송지에 도착') || s.includes('배송지에 도착하였습니다')) {
    return '배송지 도착';
  }

  // 이동 중(물류터미널 이동중, 배송지역 이동중 등)
  if (s.includes('이동중') || s.includes('이동 중')) {
    return '이동 중';
  }

  // 인수(집화 완료 등)
  if (s.includes('인수') || s.includes('인수받았습니다') || s.includes('집화')) {
    return '인수';
  }

  // 위에 해당하지 않으면 원본 그대로 사용
  return raw;
}
