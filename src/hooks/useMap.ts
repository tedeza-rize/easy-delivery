import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { LatLngTuple } from '../types/map';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  SOUTH_KOREA_BOUNDS,
  OSM_TILE_URL,
  OSM_ATTRIBUTION,
} from '../components/ParcelLocker/constants';
import {
  createLatLngBounds,
  isWithinBounds,
  safeSetView,
} from '../utils/mapUtils';

/**
 * Leaflet 지도 초기화 및 관리를 위한 커스텀 훅
 */
export const useMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  /**
   * 확대 버튼 클릭 처리 함수
   */
  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  /**
   * 축소 버튼 클릭 처리 함수
   */
  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  /**
   * 기본 보기로 이동시키는 함수
   */
  const setDefaultView = () => {
    safeSetView(leafletMapRef.current, DEFAULT_CENTER, DEFAULT_ZOOM);
  };

  /**
   * 특정 좌표로 지도를 이동시키는 함수
   */
  const moveToLocation = (coords: LatLngTuple, zoom: number = DEFAULT_ZOOM) => {
    safeSetView(leafletMapRef.current, coords, zoom);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    const southKoreaBounds = createLatLngBounds(SOUTH_KOREA_BOUNDS);

    /**
     * Leaflet 지도 인스턴스 생성
     */
    const map = L.map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      maxBounds: southKoreaBounds,
      maxBoundsViscosity: 1.0,
      minZoom: MIN_ZOOM,
      zoomControl: false,
    });

    leafletMapRef.current = map;

    /**
     * OSM 타일 레이어 추가
     */
    const tileLayer = L.tileLayer(OSM_TILE_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: MAX_ZOOM,
    });

    tileLayer.addTo(map);

    /**
     * attribution 위치를 왼쪽 아래로 이동
     */
    map.attributionControl.setPosition('bottomleft');

    /**
     * 사용자의 현재 위치 가져오기
     */
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords: LatLngTuple = [latitude, longitude];

          if (isWithinBounds(coords, SOUTH_KOREA_BOUNDS)) {
            safeSetView(leafletMapRef.current, coords, DEFAULT_ZOOM);
          } else {
            alert(
              '현재 위치가 대한민국 영역 밖으로 판정되어 기본 위치(서울시청)로 이동합니다.'
            );
            setDefaultView();
          }
        },
        () => {
          setDefaultView();
        }
      );
    } else {
      setDefaultView();
    }

    /**
     * 정리(clean-up)
     */
    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  return {
    mapRef,
    handleZoomIn,
    handleZoomOut,
    moveToLocation,
  };
};
