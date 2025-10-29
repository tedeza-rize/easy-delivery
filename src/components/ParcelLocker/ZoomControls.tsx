import React from 'react';
import {
  zoomControlWrapperStyle,
  zoomButtonStyle,
  zoomDividerStyle,
} from './styles';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

/**
 * 지도 확대/축소 컨트롤 컴포넌트
 */
const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut }) => {
  return (
    <div style={zoomControlWrapperStyle}>
      <button style={zoomButtonStyle} onClick={onZoomIn} aria-label="확대">
        +
      </button>
      <div style={zoomDividerStyle} />
      <button style={zoomButtonStyle} onClick={onZoomOut} aria-label="축소">
        −
      </button>
    </div>
  );
};

export default ZoomControls;
