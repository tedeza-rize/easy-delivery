import { keyframes } from 'styled-components';

/**
 * fadeIn: 결과 카드가 부드럽게 나타나는 애니메이션
 */
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/**
 * shimmerAnim: 토스 스타일 유사한 로딩 스켈레톤의 반짝임 애니메이션
 */
export const shimmerAnim = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;
