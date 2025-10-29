import React from 'react';
import type { SearchHistoryItem } from '../../types/tracking';
import { getCarrierDisplayName } from '../../utils/trackingUtils';
import {
  HistoryContainer,
  HistoryTitle,
  HistoryList,
  HistoryChip,
} from './styles';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onHistoryClick: (item: SearchHistoryItem) => void;
}

/**
 * SearchHistory 컴포넌트
 * - 최근 조회 기록을 chip 형태로 표시한다.
 * - chip 클릭 시 해당 택배사/송장번호를 다시 입력창에 채워준다.
 */
const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onHistoryClick,
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <HistoryContainer>
      <HistoryTitle>최근 조회</HistoryTitle>
      <HistoryList>
        {history.map((item, idx) => (
          <HistoryChip key={idx} onClick={() => onHistoryClick(item)}>
            <strong>
              {getCarrierDisplayName(
                item.carrierId,
                item.carrierName || item.carrierId
              )}
            </strong>
            <span>{item.trackingNumber}</span>
          </HistoryChip>
        ))}
      </HistoryList>
    </HistoryContainer>
  );
};

export default SearchHistory;
