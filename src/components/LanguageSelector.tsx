import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Check, X, Languages } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { lightTheme, darkTheme } from '../theme/theme';

/* -------------------------------------------------
 * 언어 옵션 정의
 * ------------------------------------------------- */
export interface LanguageOption {
  code: string;
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
];

/* -------------------------------------------------
 * Props 타입
 * ------------------------------------------------- */
interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (language: string) => void;
}

/* -------------------------------------------------
 * Styled Components
 * ------------------------------------------------- */

// 모달 오버레이 (배경 딤 처리)
const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9998;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

// 모달 컨테이너 (하단에서 올라오는 애니메이션)
const ModalContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  transform: translateY(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

// 모달 콘텐츠 (토스식 둥근 상단)
const ModalContent = styled.div`
  background-color: ${props => props.theme.cardBg};
  border-radius: 24px 24px 0 0;
  padding: 0;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1);
`;

// 헤더 영역
const Header = styled.div`
  position: sticky;
  top: 0;
  background-color: ${props => props.theme.cardBg};
  padding: 20px 16px 16px;
  border-bottom: 1px solid ${props => props.theme.divider};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
`;

const HeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.iconColor};
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.rowHoverBg};
  }

  &:active {
    transform: scale(0.95);
  }
`;

// 언어 리스트
const LanguageList = styled.ul`
  list-style: none;
  padding: 8px 0;
  margin: 0;
`;

// 언어 아이템
const LanguageItem = styled.li<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: ${props => props.$selected ? props.theme.rowHoverBg : 'transparent'};

  &:hover {
    background-color: ${props => props.theme.rowHoverBg};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LanguageItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LanguageIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: ${props => props.theme.iconColor};
`;

const LanguageLabel = styled.span<{ $selected: boolean }>`
  font-size: 17px;
  font-weight: ${props => props.$selected ? 600 : 500};
  line-height: 25.5px;
  color: ${props => props.theme.textPrimary};
`;

const CheckIcon = styled.div`
  color: ${props => props.theme.switchTrackOn};
  display: flex;
  align-items: center;
`;

// Safe Area 하단 여백 (iOS 등을 위한)
const SafeAreaBottom = styled.div`
  height: env(safe-area-inset-bottom, 20px);
  background-color: ${props => props.theme.cardBg};
`;

/* -------------------------------------------------
 * 컴포넌트
 * ------------------------------------------------- */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  const { isDarkMode } = useSettings();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const handleSelectLanguage = (languageCode: string) => {
    onSelectLanguage(languageCode);
    onClose();
  };

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <Overlay $isOpen={isOpen} onClick={handleOverlayClick} />
      <ModalContainer $isOpen={isOpen}>
        <ModalContent>
          <Header>
            <HeaderTitle>언어 선택</HeaderTitle>
            <CloseButton onClick={onClose} aria-label="닫기">
              <X size={24} />
            </CloseButton>
          </Header>

          <LanguageList>
            {LANGUAGE_OPTIONS.map((language) => {
              const isSelected = currentLanguage === language.label;
              return (
                <LanguageItem
                  key={language.code}
                  $selected={isSelected}
                  onClick={() => handleSelectLanguage(language.label)}
                >
                  <LanguageItemLeft>
                    <LanguageIconWrapper>
                      <Languages size={24} />
                    </LanguageIconWrapper>
                    <LanguageLabel $selected={isSelected}>
                      {language.label}
                    </LanguageLabel>
                  </LanguageItemLeft>
                  {isSelected && (
                    <CheckIcon>
                      <Check size={24} strokeWidth={2.5} />
                    </CheckIcon>
                  )}
                </LanguageItem>
              );
            })}
          </LanguageList>

          <SafeAreaBottom />
        </ModalContent>
      </ModalContainer>
    </ThemeProvider>
  );
};

export default LanguageSelector;
