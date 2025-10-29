import styled from 'styled-components';
import { fadeIn, shimmerAnim } from './animations';

/* 전체 페이지 래퍼 */
export const Container = styled.div`
  margin: 0 auto;
  padding: 24px;
  padding-bottom: 120px;
  background-color: #f4f6f8;
  font-family: 'Pretendard', sans-serif;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 16px;
    padding-bottom: 100px;
  }
`;

/* 상단 제목 */
export const Header = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333d4b;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

/* 입력 영역 (택배사 선택 + 송장번호 + 조회 버튼) */
export const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

/* 택배사 선택 드롭다운 */
export const SelectCarrier = styled.select`
  width: 160px;
  min-width: 140px;
  height: 52px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid #e5e8eb;
  background-color: #ffffff;
  font-size: 15px;
  color: #333d4b;
  font-weight: 500;
  appearance: none;
  background-image: none;

  &:focus {
    border-color: #3182f6;
    outline: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

/* 송장번호 입력창 */
export const Input = styled.input`
  flex-grow: 1;
  min-width: 0;
  height: 52px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #e5e8eb;
  font-size: 16px;
  background-color: #ffffff;
  color: #333d4b;

  &:focus {
    border-color: #3182f6;
    outline: none;
  }

  &::placeholder {
    color: #b0b8c1;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 15px;
  }
`;

/* 조회 버튼 */
export const TrackButton = styled.button`
  height: 52px;
  padding: 0 20px;
  border: none;
  border-radius: 12px;
  background-color: #3182f6;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1b64da;
  }

  &:disabled {
    background-color: #b0b8c1;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 15px;
  }
`;

/* 최근 조회 기록 전체 래퍼 */
export const HistoryContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 8px;
`;

/* 최근 조회 제목 */
export const HistoryTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #4e5968;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

/* 최근 조회 chip 모음 */
export const HistoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

/* 최근 조회 chip 버튼 */
export const HistoryChip = styled.button`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #e5e8eb;
  background-color: #ffffff;
  font-size: 13px;
  color: #4e5968;
  cursor: pointer;
  line-height: 1.4;
  white-space: nowrap;

  > strong {
    font-weight: 600;
    color: #333d4b;
    display: block;
  }

  > span {
    font-weight: 500;
    color: #3182f6;
    display: block;
  }

  &:hover {
    background-color: #f8fafc;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 10px;
  }
`;

/* 조회 결과 카드 */
export const ResultContainer = styled.div`
  margin-top: 32px;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  @media (max-width: 768px) {
    margin-top: 24px;
    padding: 16px;
    border-radius: 12px;
  }
`;

/* 결과 카드 상단 헤더 영역 */
export const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 24px;
  gap: 12px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
    gap: 8px;
  }
`;

/* 왼쪽 영역: 택배사명, 운송장 번호 */
export const LeftHeaderCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #4e5968;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

/* 오른쪽 영역: 상태텍스트 + 공유 버튼 */
export const RightHeaderGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
`;

/* 택배사 이름 텍스트 */
export const CarrierName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #6b7684;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

/* 운송장 번호 값 파란색 강조 */
export const ResultValue = styled.span`
  color: #3182f6;
  font-weight: 700;

  @media (max-width: 768px) {
    word-break: break-all;
  }
`;

/* 현재 상태 텍스트 */
export const StatusText = styled.span<{ $isDone: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => (props.$isDone ? '#00c471' : '#3182f6')};

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

/* 공유 버튼 */
export const ShareButton = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #e5e8eb;
  background-color: #ffffff;
  color: #4e5968;
  font-size: 13px;
  font-weight: 500;
  line-height: 32px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #f8fafc;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    padding: 0 10px;
  }
`;

/* 진행 바 전체 래퍼 */
export const ProgressBar = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0;

  @media (max-width: 768px) {
    margin: 24px 0;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 8px 0;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none;
  }
`;

/* 진행 바 가로 라인 (회색 기준선) */
export const ProgressLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e5e8eb;
  transform: translateY(-50%);
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

/* 각 단계(점 + 라벨) */
export const ProgressStep = styled.div<{ $done: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  background-color: #ffffff;
  padding: 0 4px;
  min-width: fit-content;

  @media (max-width: 768px) {
    padding: 0 8px;
    position: relative;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: -8px;
      top: 6px;
      width: 16px;
      height: 2px;
      background-color: ${(props) => (props.$done ? '#3182f6' : '#e5e8eb')};
    }
  }
`;

/* 동그란 점: 완료 여부에 따라 파란색 / 회색 */
export const StepCircle = styled.div<{ $done: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => (props.$done ? '#3182f6' : '#e5e8eb')};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
    margin-bottom: 6px;
  }
`;

/* 단계 라벨 텍스트 */
export const StepLabel = styled.span<{ $done: boolean }>`
  font-size: 14px;
  color: ${(props) => (props.$done ? '#333d4b' : '#b0b8c1')};
  font-weight: 500;
  text-align: center;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

/* 상세 이력 리스트 래퍼 */
export const DetailsContainer = styled.div`
  border-top: 1px solid #f2f4f6;
  padding-top: 16px;
`;

/* 상세 이력 한 줄 */
export const DetailItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 12px 0;
  font-size: 15px;
  color: #4e5968;
  border-bottom: 1px solid #f2f4f6;
  gap: 8px;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 4px;
    font-size: 13px;
    padding: 10px 0;
  }
`;

/* 상세 이력에서 시간 */
export const DetailTime = styled.span`
  font-weight: 500;

  @media (max-width: 768px) {
    font-weight: 600;
    color: #333d4b;
  }
`;

/* 상세 이력에서 위치 */
export const DetailLocation = styled.span`
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 12px;
    color: #6b7684;
  }
`;

/* 상세 이력에서 상태 */
export const DetailStatus = styled.span`
  text-align: right;
  font-weight: 600;
  color: #333d4b;
  word-break: break-word;

  @media (max-width: 768px) {
    text-align: left;
    font-size: 13px;
  }
`;

/* 에러 메시지 */
export const ErrorMessage = styled.p`
  color: #f04452;
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-top: 8px;
  }
`;

/* 스켈레톤 카드 전체 */
export const SkeletonCard = styled.div`
  margin-top: 32px;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  @media (max-width: 768px) {
    margin-top: 24px;
    padding: 16px;
    border-radius: 12px;
  }
`;

/* 스켈레톤 헤더 영역 */
export const SkeletonHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

/* 스켈레톤에서 반짝이는 회색 블럭 */
export const SkeletonBubble = styled.div`
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    #f2f4f6 0px,
    #e5e8eb 40px,
    #f2f4f6 80px
  );
  background-size: 200px 100%;
  animation: ${shimmerAnim} 1.2s infinite linear;
`;

/* 스켈레톤 진행 바 */
export const SkeletonProgressBar = styled.div`
  position: relative;
  margin: 24px 0 32px;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    margin: 16px 0 24px;
  }
`;

/* 스켈레톤 진행 바의 얇은 라인 */
export const SkeletonLineFull = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e5e8eb;
  transform: translateY(-50%);
`;

/* 스켈레톤 진행 바의 점 */
export const SkeletonDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e5e8eb;
  z-index: 2;

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

/* 스켈레톤 상세 이력 영역 */
export const SkeletonList = styled.div`
  border-top: 1px solid #f2f4f6;
  padding-top: 16px;
`;

/* 스켈레톤 상세 이력의 한 줄 */
export const SkeletonLineLong = styled.div`
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    #f2f4f6 0px,
    #e5e8eb 40px,
    #f2f4f6 80px
  );
  background-size: 200px 100%;
  animation: ${shimmerAnim} 1.2s infinite linear;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    height: 14px;
    margin-bottom: 12px;
  }
`;
