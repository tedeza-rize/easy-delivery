import sidoDataJson from './sido.json';
import type { SidoData, Language } from '../types/sido';
import { LANGUAGE_FIELD_MAP } from '../types/sido';

/**
 * 시/도 데이터 가져오기
 */
export const getSidoData = (): SidoData[] => {
  return sidoDataJson as SidoData[];
};

/**
 * 특정 언어로 시/도 이름 가져오기
 */
export const getSidoName = (sido: SidoData, language: Language): string => {
  const field = LANGUAGE_FIELD_MAP[language];
  return sido[field] as string;
};

/**
 * 좌표가 있는 시/도만 필터링
 */
export const getSidoWithCoordinates = (): SidoData[] => {
  return getSidoData().filter(
    (sido) => sido.latitude !== null && sido.longitude !== null
  );
};
