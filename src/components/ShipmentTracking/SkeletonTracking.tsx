import React from 'react';
import {
  SkeletonCard,
  SkeletonHeaderRow,
  SkeletonBubble,
  SkeletonProgressBar,
  SkeletonLineFull,
  SkeletonDot,
  SkeletonList,
  SkeletonLineLong,
} from './styles';

/**
 * SkeletonTracking 컴포넌트
 * - 로딩 중일 때만 보여 준다.
 * - 실제 데이터 대신 흐르는 회색 블록을 노출한다.
 */
const SkeletonTracking: React.FC = () => {
  return (
    <SkeletonCard>
      <SkeletonHeaderRow>
        {/* 운송장 번호 자리 */}
        <SkeletonBubble style={{ width: '160px', height: '20px' }} />
        {/* 상태 텍스트 자리 */}
        <SkeletonBubble style={{ width: '72px', height: '20px' }} />
      </SkeletonHeaderRow>

      <SkeletonProgressBar>
        <SkeletonLineFull />
        {/* 진행 점 4개 정도 가상 표기 */}
        <SkeletonDot />
        <SkeletonDot />
        <SkeletonDot />
        <SkeletonDot />
      </SkeletonProgressBar>

      <SkeletonList>
        {/* 최근 이벤트들 가상 줄 */}
        <SkeletonLineLong />
        <SkeletonLineLong />
        <SkeletonLineLong />
      </SkeletonList>
    </SkeletonCard>
  );
};

export default SkeletonTracking;
