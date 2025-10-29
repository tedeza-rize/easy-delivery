import type { LatLngTuple, MapBounds } from '../../types/map';

/**
 * 대한민국 경계 좌표
 * 남서쪽(southWest): 위도 33, 경도 124
 * 북동쪽(northEast): 위도 39, 경도 132
 */
export const SOUTH_KOREA_BOUNDS: MapBounds = {
  southWest: [33, 124],
  northEast: [39, 132],
};

/**
 * 기본 지도 중심 좌표 (서울시청)
 */
export const DEFAULT_CENTER: LatLngTuple = [37.5665, 126.978];

/**
 * 기본 줌 레벨
 */
export const DEFAULT_ZOOM = 16;

/**
 * 최소 줌 레벨
 */
export const MIN_ZOOM = 5;

/**
 * 최대 줌 레벨
 */
export const MAX_ZOOM = 19;

/**
 * 카테고리 칩 목록
 */
export const CATEGORY_CHIPS = [
  '주변 저장됨',
  '음식점',
  '카페',
  '편의점',
  '주유소',
] as const;

/**
 * OSM 타일 레이어 URL
 */
export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

/**
 * OSM 타일 레이어 attribution
 */
export const OSM_ATTRIBUTION = '© OpenStreetMap contributors';
