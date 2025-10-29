/**
 * 시/도 데이터 타입 정의
 */
export interface SidoData {
  sido_kr: string;
  sido_en: string;
  sido_ja: string;
  sido_zh_hans: string;
  sido_zh_hant: string;
  office_kr: string;
  office_en: string;
  latitude: number | null;
  longitude: number | null;
}

/**
 * 언어 타입
 */
export type Language = '한국어' | 'English' | '日本語' | '简体中文' | '繁体中文';

/**
 * 언어별 시/도 필드 매핑
 */
export const LANGUAGE_FIELD_MAP: Record<Language, keyof SidoData> = {
  '한국어': 'sido_kr',
  'English': 'sido_en',
  '日本語': 'sido_ja',
  '简体中文': 'sido_zh_hans',
  '繁体中文': 'sido_zh_hant',
};
