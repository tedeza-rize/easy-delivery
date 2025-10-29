import React, { useState, useEffect } from 'react';
import type {
  Carrier,
  TrackingResult,
  ApiTrackResponse,
  ApiCarriersResponse,
  SearchHistoryItem,
} from '../types/tracking';
import { getCarrierDisplayName } from '../utils/trackingUtils';
import SkeletonTracking from '../components/ShipmentTracking/SkeletonTracking';
import TrackingResultComponent from '../components/ShipmentTracking/TrackingResult';
import SearchHistory from '../components/ShipmentTracking/SearchHistory';
import {
  Container,
  Header,
  InputContainer,
  SelectCarrier,
  Input,
  TrackButton,
  ErrorMessage,
} from '../components/ShipmentTracking/styles';

/**
 * ShipmentTracking 페이지
 * - 택배사 목록 불러오기
 * - 조회 / 로딩 / 결과 표시
 * - 공유 / 최근 조회 기록 관리
 * - 상태 요약 노출
 * - NOT_FOUND 에러 처리
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
      <SearchHistory history={history} onHistoryClick={handleHistoryClick} />

      {/* 에러 메시지 */}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* 로딩 중일 때 스켈레톤 */}
      {isLoading && <SkeletonTracking />}

      {/* 조회 결과 */}
      {result && !isLoading && (
        <TrackingResultComponent result={result} onShare={handleShare} />
      )}
    </Container>
  );
};

export default ShipmentTracking;
