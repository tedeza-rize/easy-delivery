/**
 * 택배사(Delivery Tracker Carrier) 항목
 */
export interface Carrier {
  id: string;   // 예: "kr.cjlogistics"
  name: string; // 예: "CJ Logistics"
}

/**
 * 배송 단계(프런트에서 렌더링할 가공된 결과)
 */
export interface ProgressItem {
  step: string;      // 단계 설명 (ex. "집화 완료", 혹은 매우 긴 상세 문장)
  time: string;      // "MM.DD HH:mm" 형식 등 표시용 문자열
  location: string;  // 위치 문자열
  done: boolean;     // 완료 여부 (마지막 단계 전이면 false)
}

/**
 * track.php가 돌려주는 최종 조회 결과 데이터
 */
export interface TrackingResult {
  trackingNumber: string;
  carrierId: string;
  carrierName: string;
  status: string; // 예: "배송 완료", 혹은 긴 한 문장("고객님의 상품이 배송완료 되었습니다.(...)")
  progress: ProgressItem[];
}

/**
 * GraphQL 에러 정보를 표현하기 위한 타입
 * - 서버가 NOT_FOUND 등을 반환할 때 이를 해석한다.
 */
export interface GraphQLErrorInfo {
  message?: string;
  extensions?: {
    code?: string;
  };
}

/**
 * track.php의 전체 응답 구조
 */
export interface ApiTrackResponse {
  ok: boolean;
  data?: TrackingResult;
  error?: string;
  graphQLErrors?: GraphQLErrorInfo[];
}

/**
 * carriers.php의 전체 응답 구조
 */
export interface ApiCarriersResponse {
  ok: boolean;
  data?: Carrier[];
  error?: string;
}

/**
 * 최근 조회 기록에 저장할 항목
 */
export interface SearchHistoryItem {
  carrierId: string;
  carrierName: string;
  trackingNumber: string;
  timestamp: string; // ISO 문자열
}
