import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Moon, Sun, ChevronRight, Globe, Info, FileText } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { lightTheme, darkTheme } from '../theme/theme';

/* -------------------------------------------------
 * 3. 글로벌 스타일
 *    - body 배경은 theme.backgroundPage (토스식 회색 또는 Toss Gray 다크).
 * ------------------------------------------------- */
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box; /* 모든 요소에 box-sizing을 border-box로 고정하여 레이아웃 계산을 단순화 */
  }

  body {
    background-color: ${props => props.theme.backgroundPage};
    color: ${props => props.theme.textPrimary};

    margin: 0;
    padding: 0;

    /* 테마 전환 시 부드럽게 */
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }
`;

/* -------------------------------------------------
 * 4. 레이아웃 컴포넌트
 *    - SettingsContainer:
 *      토스 앱은 모바일 기준 16px 좌우 패딩
 * ------------------------------------------------- */
const SettingsContainer = styled.div`
  width: 100%;
  margin: 0 auto;            /* 가운데 정렬 */
  padding-bottom: 40px;      /* 하단 여유 공간 */
`;

/* 큰 제목 (페이지 최상단 타이틀)
 * - 토스 Typography 2는 font-size 26px / "큰 제목" 용도
 * - weight는 600 정도로 준다(토스는 굵기 단계별로 Semibold/Bold를 다양하게 사용).
 */
const ListHeader = styled.h1`
  font-size: 26px;           /* 약 "큰 제목" 계열 */
  font-weight: 600;
  line-height: 35px;         /* Typography 2 line-height가 35로 제시됨.
  padding: 32px 16px 12px;   /* 상단 여백을 넉넉히 주어 breathing space 확보 */
  margin: 0;
  color: ${props => props.theme.textPrimary};
`;

/* 섹션 캡션 (예: "정보")
 * - 토스식 섹션 캡션은 회색 톤 작은 텍스트로 카테고리를 나눠준다.
 * - Typography 11은 font-size 14px / line-height 21px "작은 본문"
 * - color는 보조 텍스트 컬러(grey500 계열).
 */
const ListSubHeader = styled.h2`
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  color: ${props => props.theme.textSecondary};
  margin: 24px 16px 8px; /* 카드 묶음 사이 간격에서 자주 보이는 24px 정도의 수직 여백 */
`;

/* 카드 묶음 자체
 * - 토스 UI에서 카드형 섹션은:
 *   흰색 배경(#ffffff),
 *   둥근 모서리(16px),
 *   1px grey200(#e5e8eb) 보더, 그리고
 *   회색 페이지 배경(grey100 #f2f4f6) 위에 약간 떠 보이는 느낌을 준다.
 */
const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 16px 24px; /* 좌우 16px, 아래로 섹션 간 24px 간격 */
  background-color: ${props => props.theme.cardBg};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.cardBorder};
  overflow: hidden;

  /* 카드가 약간 떠 있는 듯 보이는 아주 약한 음영.
     (토스는 보통 보더 위주이나, 웹에서는 살짝 음영을 주면 더 유사한 입체감이 난다.) */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.03);
`;

/* 각 행 (설정 항목 1줄)
 * - 좌우로 아이콘+타이틀 / 우측 스위치나 화살표.
 * - hover 시 grey50(#f9fafb) 같은 아주 옅은 회색으로 살짝 하이라이트.
 */
const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px 16px; /* 터치 영역을 고려해 세로 약 20px */
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.divider};
  }

  &:hover {
    background-color: ${props => props.theme.rowHoverBg};
  }
`;

/* 왼쪽(아이콘 + 텍스트) 래퍼 */
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px; /* 아이콘과 텍스트 간격 */
`;

/* 아이콘 래퍼
 * - 아이콘은 theme.iconColor로 컬러를 맞춘다.
 *   토스는 아이콘도 너무 진하지 않게 보이도록 적당한 회색 톤을 쓴다.
 */
const IconWrapper = styled.div`
  color: ${props => props.theme.iconColor};
  display: flex;
  align-items: center;
`;

/* 행 타이틀 텍스트
 * - Typography 5: font-size 17px / line-height 25.5px 이 "일반 본문"
 * - weight는 500 전후(중간 굵기)로 설정.
 * - 기본 본문 컬러 textPrimary.
 */
const Title = styled.span`
  font-size: 17px;
  font-weight: 500;
  line-height: 25.5px;
  color: ${props => props.theme.textPrimary};
`;

/* 오른쪽 섹션
 * - 스위치 또는 현재 설정 값 + '>' 아이콘 등을 담는다.
 * - 텍스트(예: "한국어")는 보조 톤 textSecondary.
 */
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* "한국어" 텍스트와 > 아이콘 사이 등 */
  color: ${props => props.theme.textSecondary};
  font-size: 15px;
  line-height: 22px;
  font-weight: 500;
`;

/* 화살표(> 아이콘)만의 컬러 톤을 조금 더 옅은 회색으로 줄 수 있도록 별도 래퍼 */
const ChevronWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.chevronColor};
`;

/* -------------------------------------------------
 * 5. 커스텀 스위치
 *    - iOS 스타일 토글 스위치를 참고.
 *    - OFF일 땐 회색 트랙(theme.switchTrackOff),
 *      ON일 땐 토스 블루 계열(theme.switchTrackOn).
 *    - thumb(하얀 동글)은 항상 흰색.
 * ------------------------------------------------- */

/* 스위치 전체 컨테이너 (크기 지정) */
const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 51px;
  height: 31px;
`;

/* 실제 체크박스 input
 * - opacity: 0 으로 숨기고,
 * - &:checked + span 으로 시각적 스타일을 조절한다.
 */
const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  /* 체크(ON) 상태일 때 트랙 색을 theme.switchTrackOn 으로 */
  &:checked + span {
    background-color: ${props => props.theme.switchTrackOn};
  }

  /* 체크(ON) 상태일 때 thumb(동그라미)를 오른쪽으로 이동 */
  &:checked + span:before {
    transform: translateX(20px);
  }
`;

/* 트랙 + thumb(동그라미) 시각 영역 */
const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: ${props => props.theme.switchTrackOff}; /* OFF 상태 트랙 */
  border-radius: 34px;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    height: 27px;
    width: 27px;
    left: 2px;
    bottom: 2px;

    background-color: ${props => props.theme.switchThumb}; /* thumb 색 (흰색) */
    border-radius: 50%;
    transition: 0.4s;
  }
`;

/* 실제 스위치 React 컴포넌트
 * - checked와 onChange만 props로 받는다.
 */
const CustomSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <SwitchContainer>
    {/*
      SwitchInput은 실제로 focus 가능한 <input type="checkbox"> 이며
      접근성 측면에서 키보드 조작도 가능하다.
    */}
    <SwitchInput type="checkbox" checked={checked} onChange={onChange} />
    {/* SwitchSlider는 시각적 트랙/동그라미 부분 */}
    <SwitchSlider />
  </SwitchContainer>
);

/* -------------------------------------------------
 * 6. 메인 Settings 컴포넌트
 *    - 다크 모드 토글을 누르면 lightTheme ↔ darkTheme 전환.
 *    - "언어" 행 오른쪽에 현재 언어("한국어")를 노출하고
 *      회색 텍스트 + 옅은 회색 화살표로 토스식 설정 행 느낌을 준다.
 * ------------------------------------------------- */
const Settings: React.FC = () => {
  // Context에서 설정값 가져오기
  const { isDarkMode, language, toggleDarkMode, setLanguage } = useSettings();

  // 현재 테마: isDarkMode 값에 따라 lightTheme 또는 darkTheme 적용
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      {/* GlobalStyle은 ThemeProvider 안에서 theme 값을 읽어 body 스타일을 갱신한다 */}
      <GlobalStyle />

      <SettingsContainer>
        {/* 최상단 페이지 타이틀 (26px 큰 제목 스타일) */}
        <ListHeader>설정</ListHeader>

        {/* 첫 번째 카드 섹션 */}
        <List>
          {/* 다크 모드 토글 행 */}
          <ListItem
            /* 행 전체를 클릭해도 토글되는 경험을 줄 수 있게 onClick에서 toggleDarkMode 호출 */
            onClick={toggleDarkMode}
          >
            <LeftSection>
              {/* 다크 모드 여부에 따라 Moon / Sun 아이콘을 토글.
                 아이콘 색상은 theme.iconColor 사용 */}
              <IconWrapper>
                {isDarkMode ? <Moon size={22} /> : <Sun size={22} />}
              </IconWrapper>

              {/* 행 타이틀: 17px / line-height 25.5px / weight 500 */}
              <Title>다크 모드</Title>
            </LeftSection>

            <RightSection
              onClick={(e: React.MouseEvent) => {
                // 부모 ListItem의 onClick이 발생하지 않도록 차단
                e.stopPropagation();
              }}
            >
              {/* 커스텀 스위치 (Toss Blue on, grey off) */}
              <CustomSwitch
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
            </RightSection>
          </ListItem>

          {/* 언어 선택 행 */}
          <ListItem>
            <LeftSection>
              <IconWrapper>
                <Globe size={22} />
              </IconWrapper>
              <Title>언어</Title>
            </LeftSection>

            {/* 오른쪽에는 현재 설정된 값("한국어")과 > 아이콘을 grey 계열로 표시 */}
            <RightSection>
              <span>{language}</span>
              <ChevronWrapper>
                <ChevronRight size={20} />
              </ChevronWrapper>
            </RightSection>
          </ListItem>
        </List>

        {/* 섹션 캡션 "정보" (14px / 21px / semibold / grey500) */}
        <ListSubHeader>정보</ListSubHeader>

        {/* 정보 섹션 카드 */}
        <List>
          {/* 서비스 정보 행 */}
          <ListItem>
            <LeftSection>
              <IconWrapper>
                <Info size={22} />
              </IconWrapper>
              <Title>서비스 정보</Title>
            </LeftSection>

            <RightSection>
              <ChevronWrapper>
                <ChevronRight size={20} />
              </ChevronWrapper>
            </RightSection>
          </ListItem>

          {/* 오픈소스 라이선스 행 */}
          <ListItem>
            <LeftSection>
              <IconWrapper>
                <FileText size={22} />
              </IconWrapper>
              <Title>오픈소스 라이선스</Title>
            </LeftSection>

            <RightSection>
              <ChevronWrapper>
                <ChevronRight size={20} />
              </ChevronWrapper>
            </RightSection>
          </ListItem>
        </List>
      </SettingsContainer>
    </ThemeProvider>
  );
};

export default Settings;