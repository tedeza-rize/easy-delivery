/**
 * 지도 관련 타입 정의
 */

/**
 * 위도/경도 좌표 타입
 */
export type LatLngTuple = [number, number];

/**
 * 지도 경계 범위 타입
 */
export interface MapBounds {
  southWest: LatLngTuple;
  northEast: LatLngTuple;
}

/**
 * 지도 설정 옵션 타입
 */
export interface MapConfig {
  center: LatLngTuple;
  zoom: number;
  minZoom: number;
  maxBounds?: MapBounds;
}
