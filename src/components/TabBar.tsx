import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Archive, Truck, Settings } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { lightTheme, darkTheme } from '../theme/theme';

// 탭 바 아이템의 타입을 정의합니다.
interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

// 탭 바 컴포넌트의 props 타입을 정의합니다.
interface TabBarProps {
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

const TabBarContainer = styled.nav`
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1000;
`;

const TabBarWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${props => props.theme.cardBg};
  padding: 10px 20px;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  border: 1px solid ${props => props.theme.cardBorder};
  transition: background-color 0.3s ease, border-color 0.3s ease;
`;

interface TabItemProps {
  $active: boolean;
}

const TabItem = styled.div<TabItemProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$active ? props.theme.textPrimary : props.theme.textSecondary};
  transition: color 0.2s ease-in-out;
  flex-grow: 1;
`;

const TabIcon = styled.div`
  margin-bottom: 4px;
  display: flex;
  align-items: center;
`;

const TabLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
`;

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabClick }) => {
  const { isDarkMode } = useSettings();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const tabs: TabItem[] = [
    { id: 'parcel', label: '무인택배함', icon: Archive },
    { id: 'tracking', label: '송장 조회', icon: Truck },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <ThemeProvider theme={currentTheme}>
      <TabBarContainer>
        <TabBarWrapper>
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => onTabClick(tab.id)}
            >
              <TabIcon>
                <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              </TabIcon>
              <TabLabel>{tab.label}</TabLabel>
            </TabItem>
          ))}
        </TabBarWrapper>
      </TabBarContainer>
    </ThemeProvider>
  );
};

export default TabBar;