import React from 'react';
import { Archive, Truck, Settings } from 'lucide-react';
import './TabBar.css';

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

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabClick }) => {
  const tabs: TabItem[] = [
    { id: 'parcel', label: '무인택배함', icon: Archive },
    { id: 'tracking', label: '송장 조회', icon: Truck },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <nav className="tab-bar-container">
      <div className="tab-bar">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabClick(tab.id)}
          >
            <tab.icon className="tab-icon" size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="tab-label">{tab.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default TabBar;