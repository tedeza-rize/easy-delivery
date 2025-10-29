import { useState } from 'react';
import TabBar from './components/TabBar';
import ParcelLocker from './pages/ParcelLocker';
import ShipmentTracking from './pages/ShipmentTracking';
import Settings from './pages/Settings';
import './App.css'; // 기본 App.css 또는 커스텀 스타일

function App() {
  // 현재 활성화된 탭을 관리하는 상태. 기본값으로 'parcel' 설정.
  const [activeTab, setActiveTab] = useState('parcel');

  // activeTab 상태에 따라 렌더링할 컴포넌트를 결정하는 함수
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
    <div className="app-container">
      {/* 선택된 탭에 맞는 콘텐츠를 보여주는 영역 */}
      <main className="content-area">
        {renderContent()}
      </main>

      {/* 하단 탭 바 */}
      <TabBar activeTab={activeTab} onTabClick={setActiveTab} />
    </div>
  );
}

export default App;