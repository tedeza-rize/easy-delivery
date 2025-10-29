import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/* -------------------------------------------------
 * 설정 타입 정의
 * ------------------------------------------------- */
export interface SettingsContextType {
  isDarkMode: boolean;
  language: string;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
}

/* -------------------------------------------------
 * Context 생성
 * ------------------------------------------------- */
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/* -------------------------------------------------
 * localStorage 키 상수
 * ------------------------------------------------- */
const STORAGE_KEYS = {
  DARK_MODE: 'easy-delivery-dark-mode',
  LANGUAGE: 'easy-delivery-language',
};

/* -------------------------------------------------
 * SettingsProvider 컴포넌트
 * ------------------------------------------------- */
interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // localStorage에서 초기값 불러오기
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved ? JSON.parse(saved) : false;
  });

  const [language, setLanguageState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return saved || '한국어';
  });

  // 다크 모드 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // 언어 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  const value: SettingsContextType = {
    isDarkMode,
    language,
    toggleDarkMode,
    setLanguage,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

/* -------------------------------------------------
 * useSettings Hook
 * ------------------------------------------------- */
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
