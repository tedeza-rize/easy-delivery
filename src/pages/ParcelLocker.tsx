import React from 'react';
import 'leaflet/dist/leaflet.css';
import { useMap } from '../hooks/useMap';
import SearchBar from '../components/ParcelLocker/SearchBar';
import CategoryChips from '../components/ParcelLocker/CategoryChips';
import ZoomControls from '../components/ParcelLocker/ZoomControls';
import {
  wrapperStyle,
  mapBoxStyle,
  topOverlayWrapperStyle,
} from '../components/ParcelLocker/styles';

/**
 * ParcelLocker 컴포넌트
 *
 * 이 컴포넌트는 다음을 수행한다.
 *
 * 1. Leaflet 지도를 전체 화면(100vw x 100vh)로 표시한다.
 *    - body 기본 margin으로 인해 생길 수 있는 여백이나 스크롤을 방지하기 위하여
 *      컴포넌트 최상위 컨테이너를 position: 'fixed' 로 잡고
 *      top/left을 0으로 두어 뷰포트 전체를 차지하게 한다.
 *
 * 2. OpenStreetMap(OSM) 타일을 사용한다.
 *    - OSM 타일은 공개적으로 사용할 수 있는 기본 지도 타일이다.
 *    - attribution(출처 표기)은 OSM 이용 약관상 반드시 화면에 나타나야 하므로 설정한다.
 *    - Leaflet 기본 attribution 컨트롤은 bottomleft 로 옮겨서
 *      커스텀 확대/축소 버튼과 겹치지 않게 한다.
 *
 * 3. 지도 스타일은 다음과 같이 구성한다.
 *    - 지도는 전체 화면을 덮는다.
 *    - 지도 위에 절대 위치(absolute position)된 UI 오버레이를 표시한다.
 *      (네이버 지도와 유사하게 상단에 검색 영역 및 카테고리 칩,
 *       우측 하단에 확대/축소 버튼 등)
 *
 * 4. 사용자의 현재 위치를 가져온다.
 *    - navigator.geolocation.getCurrentPosition 을 사용한다.
 *    - 가져온 좌표가 대한민국 경계(southKoreaBounds) 안에 있으면 그 위치로 이동한다.
 *    - 그렇지 않으면 기본 위치(서울시청 좌표)로 이동한다.
 *
 * 5. 사용자가 지도를 드래그해도 대한민국 영역 밖으로 나가지 못하도록 한다.
 *    - maxBounds, maxBoundsViscosity 옵션을 사용한다.
 *    - minZoom도 설정하여 너무 멀리 축소되는 것을 막는다.
 *
 * 6. 네이버 지도와 유사한 화면 구성을 위한 오버레이 요소
 *    - 상단 검색 바와 "주변 저장됨 / 음식점 / 카페" 와 같은 카테고리 칩을 흉내 낸다.
 *    - 하단 우측(지도의 오른쪽 아래)에 + / - 확대/축소 버튼을 둔다.
 *      이 버튼은 Leaflet의 map.zoomIn(), map.zoomOut() 을 호출한다.
 */

const ParcelLocker: React.FC = () => {
  const { mapRef, handleZoomIn, handleZoomOut } = useMap();

  return (
    <div style={wrapperStyle}>
      {/* 실제 Leaflet 지도가 삽입될 영역 */}
      <div ref={mapRef} style={mapBoxStyle} />

      {/* 상단 검색 바 + 칩 영역 (네이버 지도 유사 오버레이) */}
      <div style={topOverlayWrapperStyle}>
        <SearchBar />
        <CategoryChips />
      </div>

      {/* 우측 하단 확대/축소 컨트롤 */}
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
    </div>
  );
};

export default ParcelLocker;
