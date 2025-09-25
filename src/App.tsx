import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import LCAForm from './components/LCAForm';
import ReportsDashboard from './components/ReportsDashboard';
import MenuBar from './components/MenuBar';
import Toolbar from './components/Toolbar';
import NavigationTree from './components/NavigationTree';
import EditorArea from './components/EditorArea';

interface Tab {
  id: string;
  title: string;
  type: string;
  data?: any;
}

interface Report {
  id: string;
  name: string;
  metalType: string;
  createdDate: string;
  status: 'completed' | 'draft';
  co2Impact: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLCAForm, setShowLCAForm] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleMenuAction = (action: string) => {
    console.log('Menu action:', action);
    if (action === 'new-project') {
      setShowLCAForm(true);
    }
  };

  const handleToolbarAction = (action: string) => {
    console.log('Toolbar action:', action);
    if (action === 'new-project') {
      setShowLCAForm(true);
    }
  };

  const handleItemSelect = (item: any) => {
    const existingTab = tabs.find(tab => tab.id === item.id);
    
    if (existingTab) {
      setActiveTab(existingTab.id);
    } else {
      const newTab: Tab = {
        id: item.id,
        title: item.label,
        type: item.type || 'general',
        data: item
      };
      setTabs([...tabs, newTab]);
      setActiveTab(newTab.id);
    }
  };

  const handleTabClose = (tabId: string) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    } else if (newTabs.length === 0) {
      setActiveTab('');
    }
  };

  const handleNewTab = () => {
    const newTab: Tab = {
      id: `new-${Date.now()}`,
      title: 'New Item',
      type: 'general'
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleNewReport = () => {
    setShowLCAForm(true);
  };

  const handleLCAFormComplete = (formData: any) => {
    // Generate a new report from the form data
    const newReport: Report = {
      id: `report-${Date.now()}`,
      name: `${formData.metalType || 'Metal'} LCA Report`,
      metalType: formData.metalType || 'Unknown',
      createdDate: new Date().toLocaleDateString(),
      status: 'completed',
      co2Impact: formData.globalWarmingPotential ? `${formData.globalWarmingPotential} kg CO₂-eq` : 'TBD'
    };
    
    setReports([...reports, newReport]);
    setShowLCAForm(false);
  };

  const handleLCAFormCancel = () => {
    setShowLCAForm(false);
  };

  const handleViewReport = (reportId: string) => {
    console.log('Viewing report:', reportId);
    // Here you would implement report viewing functionality
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (showLCAForm) {
    return (
      <LCAForm 
        onComplete={handleLCAFormComplete}
        onCancel={handleLCAFormCancel}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <MenuBar onMenuAction={handleMenuAction} />
      <Toolbar onToolbarAction={handleToolbarAction} />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <NavigationTree onItemSelect={handleItemSelect} />
        </div>
        
        <div className="flex-1 flex flex-col">
          {tabs.length === 0 ? (
            <div className="flex-1 p-6">
              <ReportsDashboard 
                reports={reports}
                onNewReport={handleNewReport}
                onViewReport={handleViewReport}
              />
            </div>
          ) : (
            <EditorArea
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onTabClose={handleTabClose}
              onNewTab={handleNewTab}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;