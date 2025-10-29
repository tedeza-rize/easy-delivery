import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * 1) keyframes 정의
 *    - fadeIn: 결과 카드가 부드럽게 나타나는 애니메이션
 *    - shimmerAnim: 토스 스타일 유사한 로딩 스켈레톤의 반짝임 애니메이션
 */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmerAnim = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

/**
 * 2) styled-components 정의
 *    화면 전반의 UI 스타일, skeleton, history, 공유 버튼 등을 포함한다.
 */

/* 전체 페이지 래퍼 */
const Container = styled.div`
  margin: 0 auto;
  padding: 24px;
  padding-bottom: 120px;
  background-color: #f4f6f8;
  font-family: 'Pretendard', sans-serif;
  min-height: 100vh;
`;

/* 상단 제목 */
const Header = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333d4b;
  margin-bottom: 24px;
`;

/* 입력 영역 (택배사 선택 + 송장번호 + 조회 버튼) */
const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

/* 택배사 선택 드롭다운 */
const SelectCarrier = styled.select`
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
`;

/* 송장번호 입력창 */
const Input = styled.input`
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
`;

/* 조회 버튼 */
const TrackButton = styled.button`
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
`;

/* 최근 조회 기록 전체 래퍼 */
const HistoryContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 8px;
`;

/* 최근 조회 제목 */
const HistoryTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #4e5968;
  margin-bottom: 8px;
`;

/* 최근 조회 chip 모음 */
const HistoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

/* 최근 조회 chip 버튼
   - 택배사명 / 송장번호를 한 덩어리로 눌러서 다시 불러올 수 있도록 한다.
*/
const HistoryChip = styled.button`
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
`;

/* 조회 결과 카드 */
const ResultContainer = styled.div`
  margin-top: 32px;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

/* 결과 카드 상단 헤더 영역 */
const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

/* 왼쪽 영역: 택배사명, 운송장 번호 */
const LeftHeaderCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    color: #4e5968;
  }
`;

/* 오른쪽 영역: 상태텍스트 + 공유 버튼 */
const RightHeaderGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

/* 택배사 이름 텍스트 */
const CarrierName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #6b7684;
`;

/* 운송장 번호 값 파란색 강조 */
const ResultValue = styled.span`
  color: #3182f6;
  font-weight: 700;
`;

/* 현재 상태 텍스트
   - "배송 완료" 등 완료 상태는 초록색
   - 그 외 상태는 파란색
   - $isDone prop(Boolean)에 따라 동적으로 색상을 지정한다.
*/
const StatusText = styled.span<{ $isDone: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => (props.$isDone ? '#00c471' : '#3182f6')};
`;

/* 공유 버튼
   - Web Share API 또는 클립보드 복사 트리거
*/
const ShareButton = styled.button`
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
`;

/* 진행 바 전체 래퍼 */
const ProgressBar = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0;
`;

/* 진행 바 가로 라인 (회색 기준선) */
const ProgressLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e5e8eb;
  transform: translateY(-50%);
  z-index: 1;
`;

/* 각 단계(점 + 라벨) */
const ProgressStep = styled.div<{ $done: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  background-color: #ffffff;
  padding: 0 4px;
`;

/* 동그란 점: 완료 여부에 따라 파란색 / 회색 */
const StepCircle = styled.div<{ $done: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => (props.$done ? '#3182f6' : '#e5e8eb')};
  margin-bottom: 8px;
`;

/* 단계 라벨 텍스트
   - 완료되지 않은(미래 단계) 항목은 연한 회색
   - 완료된(과거/현재) 항목은 진한 회색
*/
const StepLabel = styled.span<{ $done: boolean }>`
  font-size: 14px;
  color: ${(props) => (props.$done ? '#333d4b' : '#b0b8c1')};
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
`;

/* 상세 이력 리스트 래퍼 (아래 테이블 비슷하게 나열) */
const DetailsContainer = styled.div`
  border-top: 1px solid #f2f4f6;
  padding-top: 16px;
`;

/* 상세 이력 한 줄 (시간 / 위치 / 상태) */
const DetailItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 12px 0;
  font-size: 15px;
  color: #4e5968;
  border-bottom: 1px solid #f2f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

/* 상세 이력에서 시간 */
const DetailTime = styled.span`
  font-weight: 500;
`;

/* 상세 이력에서 위치 */
const DetailLocation = styled.span`
  word-break: break-word;
`;

/* 상세 이력에서 상태(오른쪽 정렬, 진하게) */
const DetailStatus = styled.span`
  text-align: right;
  font-weight: 600;
  color: #333d4b;
  word-break: break-word;
`;

/* 에러 메시지 */
const ErrorMessage = styled.p`
  color: #f04452;
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
`;

/**
 * Skeleton(로딩 중 UI)
 * Delivery Tracker API를 호출하는 동안 사용자에게 "토스"류의 부드러운 로딩감을 준다.
 */

/* 스켈레톤 카드 전체 */
const SkeletonCard = styled.div`
  margin-top: 32px;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

/* 스켈레톤 헤더 영역 (좌측: 운송장번호 자리 / 우측: 상태 텍스트 자리) */
const SkeletonHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

/* 스켈레톤에서 반짝이는 회색 블럭 */
const SkeletonBubble = styled.div`
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
const SkeletonProgressBar = styled.div`
  position: relative;
  margin: 24px 0 32px;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* 스켈레톤 진행 바의 얇은 라인 */
const SkeletonLineFull = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e5e8eb;
  transform: translateY(-50%);
`;

/* 스켈레톤 진행 바의 점 */
const SkeletonDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e5e8eb;
  z-index: 2;
`;

/* 스켈레톤 상세 이력 영역 */
const SkeletonList = styled.div`
  border-top: 1px solid #f2f4f6;
  padding-top: 16px;
`;

/* 스켈레톤 상세 이력의 한 줄(회색 반짝이는 긴 막대) */
const SkeletonLineLong = styled.div`
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
`;

/**
 * 3) 타입 정의
 */

/* 택배사(Delivery Tracker Carrier) 항목 */
interface Carrier {
  id: string;   // 예: "kr.cjlogistics"
  name: string; // 예: "CJ Logistics"
}

/* 배송 단계(프런트에서 렌더링할 가공된 결과) */
interface ProgressItem {
  step: string;      // 단계 설명 (ex. "집화 완료", 혹은 매우 긴 상세 문장)
  time: string;      // "MM.DD HH:mm" 형식 등 표시용 문자열
  location: string;  // 위치 문자열
  done: boolean;     // 완료 여부 (마지막 단계 전이면 false)
}

/* track.php가 돌려주는 최종 조회 결과 데이터 */
interface TrackingResult {
  trackingNumber: string;
  carrierId: string;
  carrierName: string;
  status: string; // 예: "배송 완료", 혹은 긴 한 문장("고객님의 상품이 배송완료 되었습니다.(...)")
  progress: ProgressItem[];
}

/**
 * GraphQL 에러 정보를 표현하기 위한 타입
 * - 서버가 NOT_FOUND 등을 반환할 때 이를 해석한다.
 */
interface GraphQLErrorInfo {
  message?: string;
  extensions?: {
    code?: string;
  };
}

/* track.php의 전체 응답 구조 */
interface ApiTrackResponse {
  ok: boolean;
  data?: TrackingResult;
  error?: string;
  graphQLErrors?: GraphQLErrorInfo[];
}

/* carriers.php의 전체 응답 구조 */
interface ApiCarriersResponse {
  ok: boolean;
  data?: Carrier[];
  error?: string;
}

/* 최근 조회 기록에 저장할 항목 */
interface SearchHistoryItem {
  carrierId: string;
  carrierName: string;
  trackingNumber: string;
  timestamp: string; // ISO 문자열
}

/**
 * 4) 유틸리티
 *    - 택배사 이름 치환 맵
 *    - 상태 문구 요약 함수
 */

/**
 * CARRIER_NAME_MAP
 * 특정 택배사 ID에 대해 사용자가 보기 좋은 한국어(또는 보편적으로 쓰이는 명칭)로 치환한다.
 * 전달받은 carrierId가 이 맵에 존재하지 않으면 서버에서 내려온 원본 이름(fallbackName)을 그대로 사용한다.
 */
const CARRIER_NAME_MAP: Record<string, string> = {
  'cn.cainiao.global': '카이니아오 글로벌',
  'de.dhl': 'DHL',
  'jp.sagawa': '사가와',
  'jp.yamato': '야마토',
  'kr.actcore.ocean-inbound': 'ACT&CORE (해상 수입)',
  'kr.cjlogistics': 'CJ대한통운',
  'kr.coupangls': '쿠팡로지스틱스서비스',
  'kr.cupost': 'CU편의점택배',
  'kr.chunilps': '천일택배',
  'kr.cvsnet': 'GS Postbox',
  'kr.cway': '우리익스프레스(CWAY)',
  'kr.daesin': '대신택배',
  'kr.epantos': 'LX판토스',
  'kr.epost': '우체국택배',
  'kr.epost.ems': '우체국 EMS',
  'kr.goodstoluck': '굿스트럭',
  'kr.homepick': '홈픽',
  'kr.hanjin': '한진택배',
  'kr.honamlogis': '호남로지스',
  'kr.ilyanglogis': '일양로지스',
};

/**
 * getCarrierDisplayName
 * - carrierId를 맵에서 찾아서 치환 이름을 돌려준다.
 * - 맵에 없을 경우 fallbackName(서버에서 내려온 원래 이름)을 그대로 쓴다.
 *
 * @param id          택배사 ID (예: "kr.cjlogistics")
 * @param fallbackName 서버 응답의 carrier.name 등 원본 이름
 * @returns 화면에 표시할 최종 이름
 */
function getCarrierDisplayName(id: string, fallbackName: string): string {
  return CARRIER_NAME_MAP[id] || fallbackName || id;
}

/**
 * summarizeStatus
 * - 배송 단계/상태 문장이 너무 길 경우 상단 진행 바나 상단 상태 영역에서는
 *   "인수", "이동 중", "배송 예정", "배송 완료" 등 짧은 요약어로 치환한다.
 *
 * 이 함수는 다음 시나리오를 처리한다.
 * 예:
 *  - "보내시는 고객님으로부터 상품을 인수받았습니다" -> "인수"
 *  - "물류터미널로 상품이 이동중입니다." -> "이동 중"
 *  - "고객님의 상품이 배송지에 도착하였습니다.(...)" -> "배송지 도착"
 *  - "고객님의 상품을 배송할 예정입니다.(13~15시)..." -> "배송 예정"
 *  - "고객님의 상품이 배송완료 되었습니다.(...)" -> "배송 완료"
 *
 * @param raw 원본 상태 문자열
 * @returns 짧게 요약된 상태 문자열
 */
function summarizeStatus(raw: string): string {
  const s = raw || '';

  // 배송 완료 관련 문구
  if (s.includes('배송완료') || s.includes('배송 완료')) {
    return '배송 완료';
  }

  // 배송 예정(곧 배달할 예정 등)
  if (s.includes('배송할 예정') || s.includes('배송 예정')) {
    return '배송 예정';
  }

  // 배송지 도착(지역 도착)
  if (s.includes('배송지에 도착') || s.includes('배송지에 도착하였습니다')) {
    return '배송지 도착';
  }

  // 이동 중(물류터미널 이동중, 배송지역 이동중 등)
  if (s.includes('이동중') || s.includes('이동 중')) {
    return '이동 중';
  }

  // 인수(집화 완료 등)
  if (s.includes('인수') || s.includes('인수받았습니다') || s.includes('집화')) {
    return '인수';
  }

  // 위에 해당하지 않으면 원본 그대로 사용
  return raw;
}

/**
 * 5) SkeletonTracking 컴포넌트
 *    - 로딩 중일 때만 보여 준다.
 *    - 실제 데이터 대신 흐르는 회색 블록을 노출한다.
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

/**
 * 6) 본체 컴포넌트 ShipmentTracking
 *    - 택배사 목록 불러오기
 *    - 조회 / 로딩 / 결과 표시
 *    - 공유 / 최근 조회 기록 관리
 *    - 상태 요약 노출
 *    - NOT_FOUND 에러 처리
 */
const ShipmentTracking: React.FC = () => {
  // 사용자가 입력한 송장번호
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  // 선택된 택배사 ID (예: "kr.cjlogistics")
  const [selectedCarrier, setSelectedCarrier] = useState<string>('');

  // 택배사 목록
  const [carriers, setCarriers] = useState<Carrier[]>([]);

  // 조회 결과
  const [result, setResult] = useState<TrackingResult | null>(null);

  // 로딩 여부
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 에러 메시지
  const [error, setError] = useState<string>('');

  // 최근 조회 기록
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  /**
   * localStorage에서 최근 조회 기록을 읽어온다.
   * 형식은 [{ carrierId, carrierName, trackingNumber, timestamp }, ...]
   */
  useEffect(() => {
    try {
      const raw = localStorage.getItem('trackingHistory');
      if (raw) {
        const parsed: SearchHistoryItem[] = JSON.parse(raw);
        setHistory(parsed);
      }
    } catch {
      // 파싱 실패 시 무시
    }
  }, []);

  /**
   * 페이지 로드 시 택배사 목록을 서버에서 불러온다.
   * carriers.php는 Delivery Tracker의 carriers 쿼리를 호출하여
   * id / name 목록을 반환한다.
   */
  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        const res = await fetch(
          'https://apis.uiharu.dev/easy_delivery/api/delivery/carriers.php',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const json: ApiCarriersResponse = await res.json();

        if (json.ok && json.data) {
          setCarriers(json.data);

          // 기본값으로 첫 번째 택배사 선택 (이미 선택된 항목 없을 때만)
          if (!selectedCarrier && json.data.length > 0) {
            setSelectedCarrier(json.data[0].id);
          }
        } else {
          // 택배사 목록 불러오기 실패 시 에러만 표시하고 계속 진행 가능
          setError(json.error || '택배사 목록을 불러오지 못하였습니다.');
        }
      } catch {
        setError('택배사 목록을 불러오는 중 네트워크 오류가 발생하였습니다.');
      }
    };

    fetchCarriers();
  }, [selectedCarrier]);

  /**
   * 실제 조회 동작
   * 1. carrierId, trackingNumber 유효성 검사
   * 2. PHP 백엔드(/api/track.php)에 POST
   * 3. 결과를 상태로 저장하고, history 업데이트
   * 4. 에러 상황에서 NOT_FOUND 코드일 경우 별도 안내 메시지 처리
   */
  const handleTrack = async () => {
    if (!selectedCarrier) {
      setError('택배사를 선택해 주십시오.');
      return;
    }

    if (!trackingNumber.trim()) {
      setError('송장번호를 입력해 주십시오.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // 현재 선택된 택배사의 (원본) 이름
      const originalCarrierName =
        carriers.find((c) => c.id === selectedCarrier)?.name || '';

      // API 호출
      const res = await fetch(
        'https://apis.uiharu.dev/easy_delivery/api/delivery/track.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            carrierId: selectedCarrier,
            carrierName: originalCarrierName, // 서버에는 원본명을 보낸다.
            trackingNumber: trackingNumber.trim(),
          }),
        }
      );

      const json: ApiTrackResponse = await res.json();

      if (json.ok && json.data) {
        setResult(json.data);

        // 화면에 표시할 택배사명(한국어 등 치환된 이름)
        const uiCarrierName = getCarrierDisplayName(
          selectedCarrier,
          originalCarrierName
        );

        // history 갱신
        const newItem: SearchHistoryItem = {
          carrierId: selectedCarrier,
          carrierName: uiCarrierName,
          trackingNumber: trackingNumber.trim(),
          timestamp: new Date().toISOString(),
        };

        // 같은 (carrierId+trackingNumber) 조합은 중복 저장하지 않음
        const updatedHistory = [
          newItem,
          ...history.filter(
            (h) =>
              !(
                h.carrierId === newItem.carrierId &&
                h.trackingNumber === newItem.trackingNumber
              )
          ),
        ].slice(0, 10); // 최대 10개까지만 유지

        setHistory(updatedHistory);
        localStorage.setItem('trackingHistory', JSON.stringify(updatedHistory));
      } else {
        /**
         * 여기서 graphQLErrors를 확인한다.
         * 만약 code === 'NOT_FOUND'라면, 아직 배송 정보가 시스템에 등록되지
         * 않았거나 올바르지 않은 송장번호일 가능성이 높으므로
         * 별도의 안내 문구를 사용자에게 노출한다.
         */
        const notFoundLike =
          json.graphQLErrors &&
          json.graphQLErrors.some(
            (err) => err.extensions && err.extensions.code === 'NOT_FOUND'
          );

        if (notFoundLike) {
          setError(
            '아직 배송 정보가 등록되지 않았거나 올바르지 않은 송장번호일 수 있다. 송장 정보가 반영되기까지 시간차가 있을 수 있으므로 잠시 후 다시 조회해 주기 바란다.'
          );
        } else {
          setError(json.error || '배송 정보를 가져오지 못하였다.');
        }
      }
    } catch {
      setError('네트워크 오류가 발생하였다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 최근 조회 chip 클릭 시
   * 해당 택배사 / 송장번호를 다시 입력창에 채워 준다.
   * 사용자는 곧바로 "조회하기"를 눌러 재조회할 수 있다.
   */
  const handleHistoryClick = (item: SearchHistoryItem) => {
    setSelectedCarrier(item.carrierId);
    setTrackingNumber(item.trackingNumber);
  };

  /**
   * 공유 버튼
   * 1) 지원 브라우저: Web Share API 사용
   * 2) 미지원 브라우저: 현재 상태 텍스트를 클립보드에 복사
   */
  const handleShare = async () => {
    if (!result) return;

    const shareText = `${getCarrierDisplayName(
      result.carrierId,
      result.carrierName
    )} ${result.trackingNumber}
현재 상태: ${result.status}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: '배송 조회 결과',
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        window.alert('현재 상태 텍스트가 복사되었다.');
      }
    } catch {
      window.alert('공유에 실패하였다.');
    }
  };

  /**
   * 렌더링
   */
  return (
    <Container>
      {/* 상단 제목 */}
      <Header>송장 조회</Header>

      {/* 입력 영역: 택배사 선택 + 송장번호 + 버튼 */}
      <InputContainer>
        <SelectCarrier
          value={selectedCarrier}
          onChange={(e) => setSelectedCarrier(e.target.value)}
        >
          {carriers.map((carrier) => (
            <option key={carrier.id} value={carrier.id}>
              {getCarrierDisplayName(carrier.id, carrier.name)}
            </option>
          ))}
        </SelectCarrier>

        <Input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="- 없이 숫자만 입력"
        />

        <TrackButton onClick={handleTrack} disabled={isLoading}>
          {isLoading ? '조회 중...' : '조회하기'}
        </TrackButton>
      </InputContainer>

      {/* 최근 조회 기록 노출 */}
      {history.length > 0 && (
        <HistoryContainer>
          <HistoryTitle>최근 조회</HistoryTitle>
          <HistoryList>
            {history.map((item, idx) => (
              <HistoryChip key={idx} onClick={() => handleHistoryClick(item)}>
                <strong>
                  {
                    getCarrierDisplayName(
                      item.carrierId,
                      item.carrierName || item.carrierId
                    )
                    /* 혹시 이름이 비어 있을 경우 대비 */
                  }
                </strong>
                <span>{item.trackingNumber}</span>
              </HistoryChip>
            ))}
          </HistoryList>
        </HistoryContainer>
      )}

      {/* 에러 메시지 */}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* 로딩 중일 때 스켈레톤 */}
      {isLoading && <SkeletonTracking />}

      {/* 조회 결과 */}
      {result && !isLoading && (
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
              {/* 상단 상태 텍스트는 긴 문장을 summarizeStatus로 요약한다.
                 예: "고객님의 상품이 배송완료 되었습니다.(...)" -> "배송 완료"
                 완료(배송 완료 등)인 경우 초록색으로 표시하기 위해 isDone 값을 true로 준다.
              */}
              {(() => {
                const summary = summarizeStatus(result.status);
                const isDone = summary.includes('완료'); // "배송 완료" 등 완료 상태일 경우 true
                return (
                  <StatusText $isDone={isDone}>{summary}</StatusText>
                );
              })()}

              <ShareButton onClick={handleShare}>공유</ShareButton>
            </RightHeaderGroup>
          </ResultHeader>

          {/* 상단 진행 바
             progress 배열을 순서대로 점/라벨로 렌더링한다.
             - done=false인 마지막 항목(아직 완료 안 된 "배송 예정" 등)은 회색 처리한다.
             - 라벨은 summarizeStatus(...)로 요약하여 너무 긴 문장을 줄여 표시한다.
          */}
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
             - 상세 이력 테이블에서는 원문을 그대로 보여준다(시간/위치/상세문장).
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
      )}
    </Container>
  );
};

export default ShipmentTracking;
