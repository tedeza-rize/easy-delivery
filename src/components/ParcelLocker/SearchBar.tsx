import React from 'react';
import {
  searchBarStyle,
  searchInputFakeStyle,
  directionButtonStyle,
} from './styles';

/**
 * 검색 바 컴포넌트
 */
const SearchBar: React.FC = () => {
  return (
    <div style={searchBarStyle}>
      <div style={searchInputFakeStyle}>Place, Bus, Subway or Addr.</div>
      <div style={directionButtonStyle}>길찾기</div>
    </div>
  );
};

export default SearchBar;
