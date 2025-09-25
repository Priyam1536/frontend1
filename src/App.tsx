import React, { useState } from 'react';
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

function App() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [showConsole, setShowConsole] = useState(true);

  const handleMenuAction = (action: string) => {
    console.log('Menu action:', action);
    // Handle menu actions here
  };

  const handleToolbarAction = (action: string) => {
    console.log('Toolbar action:', action);
    // Handle toolbar actions here
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

  const toggleConsole = () => {
    setShowConsole(!showConsole);
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
          <EditorArea
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onTabClose={handleTabClose}
            onNewTab={handleNewTab}
          />
          
          <ConsolePanel
            isVisible={showConsole}
            onToggle={toggleConsole}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
