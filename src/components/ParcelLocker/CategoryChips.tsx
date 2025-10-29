import React, { useState } from 'react';
import { chipRowStyle, chipStyle, chipSelectedStyle } from './styles';
import { getSidoWithCoordinates, getSidoName } from '../../data/sidoUtils';
import { useSettings } from '../../contexts/SettingsContext';
import type { LatLngTuple } from '../../types/map';
import type { SidoData, Language } from '../../types/sido';

/**
 * 시/도 선택 칩 컴포넌트 Props
 */
interface CategoryChipsProps {
  onSidoSelect: (coords: LatLngTuple) => void;
}

/**
 * 시/도 선택 칩 컴포넌트
 */
const CategoryChips: React.FC<CategoryChipsProps> = ({ onSidoSelect }) => {
  const { language } = useSettings();
  const [selectedSido, setSelectedSido] = useState<string | null>(null);
  const sidoList = getSidoWithCoordinates();

  const handleSidoClick = (sido: SidoData) => {
    const sidoName = getSidoName(sido, language as Language);
    setSelectedSido(sidoName);

    // 좌표가 있으면 지도 이동
    if (sido.latitude !== null && sido.longitude !== null) {
      onSidoSelect([sido.latitude, sido.longitude]);
    }
  };

  return (
    <div style={chipRowStyle}>
      {sidoList.map((sido) => {
        const sidoName = getSidoName(sido, language as Language);
        const isSelected = selectedSido === sidoName;

        return (
          <div
            key={sido.sido_kr}
            style={isSelected ? { ...chipStyle, ...chipSelectedStyle } : chipStyle}
            onClick={() => handleSidoClick(sido)}
          >
            {sidoName}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryChips;
