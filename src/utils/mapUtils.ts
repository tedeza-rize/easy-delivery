import L from 'leaflet';
import type { LatLngTuple, MapBounds } from '../types/map';

/**
 * 주어진 좌표가 경계 범위 안에 있는지 확인
 */
export const isWithinBounds = (
  coords: LatLngTuple,
  bounds: MapBounds
): boolean => {
  const latLngBounds = L.latLngBounds(
    L.latLng(bounds.southWest[0], bounds.southWest[1]),
    L.latLng(bounds.northEast[0], bounds.northEast[1])
  );
  return latLngBounds.contains(L.latLng(coords[0], coords[1]));
};

/**
 * Leaflet LatLngBounds 객체 생성
 */
export const createLatLngBounds = (bounds: MapBounds): L.LatLngBounds => {
  return L.latLngBounds(
    L.latLng(bounds.southWest[0], bounds.southWest[1]),
    L.latLng(bounds.northEast[0], bounds.northEast[1])
  );
};

/**
 * 안전하게 지도 뷰를 설정하는 헬퍼 함수
 * - 맵이 준비될 때까지 대기하고
 * - 컴포넌트 언마운트로 map이 제거된 경우 호출을 무시
 */
export const safeSetView = (
  map: L.Map | null,
  center: LatLngTuple,
  zoom: number
): void => {
  if (!map) return;

  map.whenReady(() => {
    if (!map) return;
    try {
      map.setView(center, zoom);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('safeSetView 실패:', e);
    }
  });
};
