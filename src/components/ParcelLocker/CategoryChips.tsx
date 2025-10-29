import React from 'react';
import { chipRowStyle, chipStyle } from './styles';
import { CATEGORY_CHIPS } from './constants';

/**
 * 카테고리 칩 컴포넌트
 */
const CategoryChips: React.FC = () => {
  return (
    <div style={chipRowStyle}>
      {CATEGORY_CHIPS.map((chip) => (
        <div key={chip} style={chipStyle}>
          {chip}
        </div>
      ))}
    </div>
  );
};

export default CategoryChips;
