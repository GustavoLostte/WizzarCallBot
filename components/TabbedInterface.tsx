import React, { useState, ReactNode } from 'react';
import { TabProps } from '../types';

interface TabbedInterfaceProps {
  tabs: {
    label: string;
    content: ReactNode;
  }[];
  initialActiveTab?: number;
}

const TabbedInterface: React.FC<TabbedInterfaceProps> = ({ tabs, initialActiveTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const TabButton: React.FC<TabProps> = ({ label, isActive, onClick }) => (
    <button
      className={`py-2 px-4 text-sm md:text-base font-medium rounded-t-lg transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-300 bg-white rounded-t-lg shadow-sm">
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            label={tab.label}
            isActive={index === activeTab}
            onClick={() => setActiveTab(index)}
          />
        ))}
      </div>
      <div className="flex-grow p-0 rounded-b-lg overflow-hidden">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default TabbedInterface;
