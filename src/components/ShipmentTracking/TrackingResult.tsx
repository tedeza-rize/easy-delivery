import React from 'react';
import type { TrackingResult as TrackingResultType } from '../../types/tracking';
import { getCarrierDisplayName, summarizeStatus } from '../../utils/trackingUtils';
import {
  ResultContainer,
  ResultHeader,
  LeftHeaderCol,
  RightHeaderGroup,
  CarrierName,
  ResultValue,
  StatusText,
  ShareButton,
  ProgressBar,
  ProgressLine,
  ProgressStep,
  StepCircle,
  StepLabel,
  DetailsContainer,
  DetailItem,
  DetailTime,
  DetailLocation,
  DetailStatus,
} from './styles';

interface TrackingResultProps {
  result: TrackingResultType;
  onShare: () => void;
}

/**
 * TrackingResult 컴포넌트
 * - 배송 조회 결과를 표시한다.
 * - 상단 헤더, 진행 바, 상세 이력을 포함한다.
 */
const TrackingResult: React.FC<TrackingResultProps> = ({ result, onShare }) => {
  const summary = summarizeStatus(result.status);
  const isDone = summary.includes('완료');

  return (
    <ResultContainer>
      <ResultHeader>
        <LeftHeaderCol>
          {/* 택배사 이름은 한국어 치환본을 우선적으로 사용한다 */}
          <CarrierName>
            {getCarrierDisplayName(result.carrierId, result.carrierName)}
          </CarrierName>

          <h2>
            운송장 번호{' '}
            <ResultValue>{result.trackingNumber}</ResultValue>
          </h2>
        </LeftHeaderCol>

        <RightHeaderGroup>
          {/* 상단 상태 텍스트는 긴 문장을 summarizeStatus로 요약한다. */}
          <StatusText $isDone={isDone}>{summary}</StatusText>
          <ShareButton onClick={onShare}>공유</ShareButton>
        </RightHeaderGroup>
      </ResultHeader>

      {/* 상단 진행 바 */}
      <ProgressBar>
        {/* 회색 라인 */}
        <ProgressLine />

        {result.progress.map((item, index) => {
          const compactLabel = summarizeStatus(item.step);
          return (
            <ProgressStep key={index} $done={item.done}>
              <StepCircle $done={item.done} />
              <StepLabel $done={item.done}>{compactLabel}</StepLabel>
            </ProgressStep>
          );
        })}
      </ProgressBar>

      {/* 상세 이력
         - progress는 과거 → 현재 순서로 들어있다고 가정한다.
         - 화면에서는 최신 이벤트가 위로 오도록 reverse() 후 출력한다.
         - 아직 완료되지 않은 마지막 단계(done=false)는 실제 발생 이력이 아니므로 제외한다.
      */}
      <DetailsContainer>
        {result.progress
          .slice()
          .reverse()
          .map((item, index) =>
            item.done ? (
              <DetailItem key={index}>
                <DetailTime>{item.time}</DetailTime>
                <DetailLocation>{item.location}</DetailLocation>
                <DetailStatus>{item.step}</DetailStatus>
              </DetailItem>
            ) : null
          )}
      </DetailsContainer>
    </ResultContainer>
  );
};

export default TrackingResult;
