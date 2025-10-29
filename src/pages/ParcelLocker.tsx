import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  /**
   * mapRef
   * - 실제로 Leaflet 지도가 렌더링될 <div> 요소를 가리킨다.
   */
  const mapRef = useRef<HTMLDivElement | null>(null);

  /**
   * leafletMapRef
   * - Leaflet 지도 인스턴스를 React 외부에서도 참조하기 위한 ref이다.
   * - 확대/축소 버튼 클릭 시 map.zoomIn(), map.zoomOut() 에 접근해야 하므로
   *   컴포넌트 전체에서 접근 가능한 ref로 저장한다.
   */
  const leafletMapRef = useRef<L.Map | null>(null);

  /**
   * 확대 버튼 클릭 처리 함수
   * - leafletMapRef.current 가 존재하면 zoomIn() 을 호출하여 지도를 확대한다.
   */
  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  /**
   * 축소 버튼 클릭 처리 함수
   * - leafletMapRef.current 가 존재하면 zoomOut() 을 호출하여 지도를 축소한다.
   */
  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  useEffect(() => {
    // 아직 mapRef.current 가 준비되지 않았다면 아무 것도 하지 않는다.
    if (!mapRef.current) return;

    /**
     * 대한민국(위도/경도 대략 범위)을 감싸는 경계 상자이다.
     * 남서쪽(southWest): 위도 33, 경도 124
     * 북동쪽(northEast): 위도 39, 경도 132
     *
     * 이 경계는 사용자가 드래그로 벗어나지 못하도록 하는 데 사용된다.
     */
    const southKoreaBounds = L.latLngBounds(
      L.latLng(33, 124), // 남서쪽
      L.latLng(39, 132)  // 북동쪽
    );

    /**
     * Leaflet 지도 인스턴스를 생성한다.
     *
     * 주요 옵션:
     * - center: 초기 중심 좌표를 서울시청 근처로 잡는다.
     * - zoom: 초기 확대 수준을 16으로 설정한다.
     * - maxBounds: 위에서 설정한 대한민국 영역을 사용자가 벗어날 수 없도록 지정한다.
     * - maxBoundsViscosity: 1.0에 가까울수록 경계 밖으로 드래그하려 할 때
     *   튕겨 돌아오도록 강하게 제한한다.
     * - minZoom: 사용자가 너무 멀리 축소하여 전 세계 지도가 한 화면에 나오지 않도록 제한한다.
     * - zoomControl: false 로 설정하여 Leaflet 기본 확대/축소 컨트롤을 숨긴다.
     *   이후 오른쪽 아래에 커스텀 확대/축소 버튼을 배치한다.
     */
    const map = L.map(mapRef.current, {
      center: [37.5665, 126.9780], // 서울시청 위도/경도
      zoom: 16,
      maxBounds: southKoreaBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 5,
      zoomControl: false,
    });

    // Leaflet 지도 인스턴스를 ref에 저장하여 외부(버튼 핸들러 등)에서 접근 가능하게 한다.
    leafletMapRef.current = map;

    /**
     * OSM(OpenStreetMap) 기본 타일 레이어를 구성한다.
     *
     * {s}: 서브도메인 (a, b, c 등이 들어간다)
     * {z}: 줌 레벨
     * {x}: 타일의 X 좌표
     * {y}: 타일의 Y 좌표
     *
     * attribution:
     * - "© OpenStreetMap contributors" 표기는 OSM 이용 조건상 필수이다.
     * - maxZoom 은 일반적으로 19까지 지원된다.
     */
    const tileLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }
    );

    // 타일 레이어를 지도에 추가한다.
    tileLayer.addTo(map);

    /**
     * 기본 보기로 이동시키는 함수이다.
     * - 서울시청 좌표(37.5665, 126.9780)를 중심으로 하고 줌 레벨은 16이다.
     * - 위치 정보를 얻지 못했거나,
     *   위치는 얻었으나 대한민국 영역 밖일 경우 이 함수를 호출한다.
     */
    // 안전하게 setView 를 호출하는 헬퍼
    // - 맵이 준비될 때까지 대기하고
    // - 컴포넌트 언마운트로 map이 제거된 경우 호출을 무시한다.
    const safeSetView = (center: [number, number], zoom: number) => {
      // leafletMapRef.current 이 없으면 이미 언마운트 되었거나 map이 제거된 상태이므로 무시
      if (!leafletMapRef.current) return;

      // whenReady 는 map이 초기화되어 있지 않다면 준비될 때 호출되며,
      // 준비되어 있으면 즉시 실행된다.
      leafletMapRef.current.whenReady(() => {
        if (!leafletMapRef.current) return;
        try {
          leafletMapRef.current.setView(center, zoom);
        } catch (e) {
          // 안전을 위해 예외를 무시하되, 개발 모드에서 콘솔에 로깅
          // (실사용에서는 로깅 전략을 조정)
          // eslint-disable-next-line no-console
          console.warn('safeSetView 실패:', e);
        }
      });
    };

    const setDefaultView = () => {
      safeSetView([37.5665, 126.9780], 16); // 서울시청 근처
    };

    /**
     * 지도 attribution(출처 표기)을 화면 왼쪽 아래로 옮긴다.
     * 이렇게 하면 화면 오른쪽 아래에 배치할 커스텀 확대/축소 버튼과 겹치지 않는다.
     */
    map.attributionControl.setPosition('bottomleft');

    /**
     * HTML5 Geolocation API를 사용하여 현재 위치를 가져온다.
     *
     * 1. 성공적으로 좌표를 얻은 경우:
     *    - 해당 좌표가 southKoreaBounds 안에 있는지 확인한다.
     *    - 만약 안에 있다면 그 좌표로 지도를 이동한다.
     *    - 만약 밖이라면 안내 메시지를 띄우고 기본 보기로 돌린다.
     *
     * 2. 좌표를 얻지 못한 경우(권한 거부 등):
     *    - 기본 보기로 돌린다.
     */
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // 현재 좌표가 대한민국 경계 안에 있는지 확인한다.
          if (southKoreaBounds.contains(L.latLng(latitude, longitude))) {
            // 대한민국 안이면 그 위치로 시야를 옮긴다.
            safeSetView([latitude, longitude], 16);
          } else {
            // 대한민국 밖이면 안내 후 기본 보기로 돌아간다.
            alert(
              '현재 위치가 대한민국 영역 밖으로 판정되어 기본 위치(서울시청)로 이동합니다.'
            );
            setDefaultView();
          }
        },
        () => {
          // 위치 접근에 실패한 경우 기본 보기로 이동한다.
          setDefaultView();
        }
      );
    } else {
      // 브라우저가 geolocation API를 지원하지 않는 경우에도 기본 보기로 이동한다.
      setDefaultView();
    }

    /**
     * 컴포넌트 언마운트 시 정리(clean-up)를 수행한다.
     * - map.remove() 를 호출하여 Leaflet 인스턴스와 이벤트 리스너를 정리한다.
     * - leafletMapRef.current 또한 null 로 되돌린다.
     */
    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  /**
   * 스타일 상수
   * 각 상수는 JSX에 반복적으로 들어가는 style 객체를 정리하여
   * 코드 가독성을 높이기 위한 것이다.
   */

  // 화면 전체를 덮는 최상위 컨테이너 스타일
  const wrapperStyle: React.CSSProperties = {
    position: 'fixed', // 뷰포트 전체를 덮기 위하여 fixed 사용
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden', // 스크롤 바가 나타나지 않도록 hidden 처리
    backgroundColor: '#ffffff', // 지도가 로드되기 전 흰색 화면
    fontFamily:
      // 시스템 폰트 계열 지정 (안드로이드/윈도우 등에서 모바일 지도 느낌과 유사하게 하기 위함)
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", "Helvetica Neue", Arial, sans-serif',
  };

  // 실제 Leaflet 지도가 렌더링되는 영역
  const mapBoxStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  // 상단 검색 바와 카테고리 칩들을 담는 전체 오버레이 컨테이너
  // pointerEvents: 'none' 으로 깔고, 내부 개별 박스는 다시 'auto' 로 주어
  // 필요한 영역만 상호작용 가능하게 한다.
  const topOverlayWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: '12px',
    left: '12px',
    right: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 1000, // 지도 위로 올라오게 한다.
    pointerEvents: 'none', // 기본적으로 이벤트를 통과시키되,
  };

  // 검색 바 스타일 (네이버 지도 상단 바와 유사한 느낌의 흰색 카드 형태)
  const searchBarStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    pointerEvents: 'auto', // 이 요소에서는 클릭, 입력 등이 가능하도록 한다.
  };

  // 검색 바 왼쪽의 텍스트 영역 스타일
  const searchInputFakeStyle: React.CSSProperties = {
    flex: 1,
    color: '#666666',
    fontSize: '14px',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  // 우측의 파란색(또는 강조색) 버튼처럼 보이는 작은 사각형
  const directionButtonStyle: React.CSSProperties = {
    flexShrink: 0,
    backgroundColor: '#1976d2', // 파란색 계열. 실제 네이버 지도와 색상은 다르지만 시각적 강조 역할
    color: '#ffffff',
    fontSize: '12px',
    lineHeight: 1.2,
    fontWeight: 600,
    borderRadius: '4px',
    padding: '6px 8px',
  };

  // 카테고리 칩들을 담는 행(Row) 스타일
  const chipRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '6px',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    pointerEvents: 'auto', // 칩 자체를 클릭할 수 있도록 auto
  };

  // 개별 칩의 스타일 (흰색 배경, 테두리, 약간의 그림자 느낌)
  const chipStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid rgba(0,0,0,0.15)',
    borderRadius: '16px',
    padding: '6px 10px',
    fontSize: '12px',
    lineHeight: 1.2,
    color: '#333333',
    whiteSpace: 'nowrap',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  // 우측 하단 확대/축소 컨트롤 컨테이너 스타일
  const zoomControlWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    right: '16px',
    bottom: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    border: '1px solid rgba(0,0,0,0.15)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    pointerEvents: 'auto', // 버튼 클릭 가능하게 한다.
  };

  // 확대/축소 버튼의 공통 스타일
  const zoomButtonStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: 1,
    cursor: 'pointer',
  };

  // 확대/축소 버튼 사이 구분선 스타일
  const zoomDividerStyle: React.CSSProperties = {
    width: '100%',
    height: '1px',
    backgroundColor: 'rgba(0,0,0,0.1)',
  };

  /**
   * JSX 반환부
   * - wrapperStyle 로 전체 화면을 덮는 컨테이너를 만든다.
   * - mapBoxStyle 을 사용하여 지도용 <div>를 전체에 깔아 Leaflet이 여기에 그리도록 한다.
   * - 그 위에 topOverlayWrapperStyle 로 검색 창과 카테고리 칩을 오버레이한다.
   * - 우측 하단에 zoomControlWrapperStyle 로 + / - 버튼을 오버레이한다.
   *
   * 이 구성은 모바일 네이버 지도 화면과 유사하게
   * "지도가 전체 화면에 깔려 있고, 그 위에 UI 요소가 얹혀 있는" 형태로 보이게 한다.
   */
  return (
    <div style={wrapperStyle}>
      {/* 실제 Leaflet 지도가 삽입될 영역 */}
      <div ref={mapRef} style={mapBoxStyle} />

      {/* 상단 검색 바 + 칩 영역 (네이버 지도 유사 오버레이) */}
      <div style={topOverlayWrapperStyle}>
        {/* 검색 바 */}
        <div style={searchBarStyle}>
          <div style={searchInputFakeStyle}>
            Place, Bus, Subway or Addr.
          </div>
          <div style={directionButtonStyle}>길찾기</div>
        </div>

        {/* 카테고리 칩 영역 */}
        <div style={chipRowStyle}>
          <div style={chipStyle}>주변 저장됨</div>
          <div style={chipStyle}>음식점</div>
          <div style={chipStyle}>카페</div>
          <div style={chipStyle}>편의점</div>
          <div style={chipStyle}>주유소</div>
        </div>
      </div>

      {/* 우측 하단 확대/축소 컨트롤 */}
      <div style={zoomControlWrapperStyle}>
        <button
          style={zoomButtonStyle}
          onClick={handleZoomIn}
          aria-label="확대"
        >
          +
        </button>
        <div style={zoomDividerStyle} />
        <button
          style={zoomButtonStyle}
          onClick={handleZoomOut}
          aria-label="축소"
        >
          −
        </button>
      </div>
    </div>
  );
};

export default ParcelLocker;
