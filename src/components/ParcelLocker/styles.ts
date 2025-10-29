import React from 'react';

/**
 * ParcelLocker 컴포넌트 스타일 정의
 */

/**
 * 화면 전체를 덮는 최상위 컨테이너 스타일
 */
export const wrapperStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", "Helvetica Neue", Arial, sans-serif',
};

/**
 * 실제 Leaflet 지도가 렌더링되는 영역
 */
export const mapBoxStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

/**
 * 상단 검색 바와 카테고리 칩들을 담는 전체 오버레이 컨테이너
 */
export const topOverlayWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  left: '12px',
  right: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  zIndex: 1000,
  pointerEvents: 'none',
};

/**
 * 검색 바 스타일
 */
export const searchBarStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid rgba(0,0,0,0.1)',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  padding: '10px 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  pointerEvents: 'auto',
};

/**
 * 검색 바 왼쪽의 텍스트 영역 스타일
 */
export const searchInputFakeStyle: React.CSSProperties = {
  flex: 1,
  color: '#666666',
  fontSize: '14px',
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

/**
 * 우측의 파란색 버튼 스타일
 */
export const directionButtonStyle: React.CSSProperties = {
  flexShrink: 0,
  backgroundColor: '#1976d2',
  color: '#ffffff',
  fontSize: '12px',
  lineHeight: 1.2,
  fontWeight: 600,
  borderRadius: '4px',
  padding: '6px 8px',
};

/**
 * 카테고리 칩들을 담는 행(Row) 스타일
 */
export const chipRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'nowrap',
  gap: '6px',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  pointerEvents: 'auto',
};

/**
 * 개별 칩의 스타일
 */
export const chipStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: '16px',
  padding: '6px 10px',
  fontSize: '12px',
  lineHeight: 1.2,
  color: '#333333',
  whiteSpace: 'nowrap',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

/**
 * 선택된 칩의 스타일
 */
export const chipSelectedStyle: React.CSSProperties = {
  backgroundColor: '#1976d2',
  color: '#ffffff',
  border: '1px solid #1976d2',
  fontWeight: 600,
};

/**
 * 우측 하단 확대/축소 컨트롤 컨테이너 스타일
 */
export const zoomControlWrapperStyle: React.CSSProperties = {
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
  pointerEvents: 'auto',
};

/**
 * 확대/축소 버튼의 공통 스타일
 */
export const zoomButtonStyle: React.CSSProperties = {
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

/**
 * 확대/축소 버튼 사이 구분선 스타일
 */
export const zoomDividerStyle: React.CSSProperties = {
  width: '100%',
  height: '1px',
  backgroundColor: 'rgba(0,0,0,0.1)',
};
