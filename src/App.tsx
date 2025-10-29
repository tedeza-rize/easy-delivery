import { useState } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import TabBar from './components/TabBar';
import ParcelLocker from './pages/ParcelLocker';
import ShipmentTracking from './pages/ShipmentTracking';
import Settings from './pages/Settings';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { lightTheme, darkTheme } from './theme/theme';
import './App.css'; // 기본 App.css 또는 커스텀 스타일

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.backgroundPage};
    color: ${props => props.theme.textPrimary};
    margin: 0;
    padding: 0;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentArea = styled.main`
  flex-grow: 1;
`;

function AppContent() {
  const [activeTab, setActiveTab] = useState('parcel');
  const { isDarkMode } = useSettings();
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const renderContent = () => {
    switch (activeTab) {
      case 'parcel':
        return <ParcelLocker />;
      case 'tracking':
        return <ShipmentTracking />;
      case 'settings':
        return <Settings />;
      default:
        return <ParcelLocker />;
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <AppContainer>
        <ContentArea>
          {renderContent()}
        </ContentArea>
        <TabBar activeTab={activeTab} onTabClick={setActiveTab} />
      </AppContainer>
    </ThemeProvider>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;