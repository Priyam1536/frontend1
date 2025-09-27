import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage.jsx';
import LCAForm from './components/LCAForm.jsx';
import ReportsDashboard from './components/ReportsDashboard.jsx';
import MenuBar from './components/MenuBar.jsx';
import Toolbar from './components/Toolbar.jsx';
import NavigationTree from './components/NavigationTree.jsx';
import EditorArea from './components/EditorArea.jsx';
import Dashboard from './components/Dashboard';
import LCAResultsPage from './components/LCAResultsPage.jsx';

import { tokenStorage, authAPI } from './utils/api.jsx';

import PathwayComparisonModal from './components/PathwayComparisonModal.jsx';


function App() {
  // Initialize login state from token storage
  const [isLoggedIn, setIsLoggedIn] = useState(!!tokenStorage.getToken());
  const [userData, setUserData] = useState(tokenStorage.getUserData());
  const [showLCAForm, setShowLCAForm] = useState(false);
  const [showPathwayComparison, setShowPathwayComparison] = useState(false);
  const [reports, setReports] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentReport, setCurrentReport] = useState(null);
  const [currentInsights, setCurrentInsights] = useState(null);

  // Verify token is valid on initial load
  useEffect(() => {
    const verifyToken = async () => {
      const token = tokenStorage.getToken();
      if (token) {
        try {
          // Attempt to get user profile with the stored token
          const profile = await authAPI.getProfile(token);
          setUserData(profile);
          setIsLoggedIn(true);
        } catch (error) {
          // Token is invalid, clear it
          console.error("Invalid token:", error);
          tokenStorage.removeToken();
          tokenStorage.clearUserData();
          setIsLoggedIn(false);
        }
      }
    };
    
    verifyToken();
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData);
  };

  const handleLogout = () => {
    tokenStorage.removeToken();
    tokenStorage.clearUserData();
    setIsLoggedIn(false);
    setUserData(null);
  };

  const handleMenuAction = (action) => {
    console.log('Menu action:', action);
    if (action === 'new-project') {
      setShowLCAForm(true);
    }
  };

  const handleToolbarAction = (action) => {
    console.log('Toolbar action:', action);
    if (action === 'new-project') {
      setShowLCAForm(true);
    }
  };

  const handleItemSelect = (item) => {
    if (!item) return; // Guard against null/undefined items
    
    const existingTab = tabs.find(tab => tab.id === item.id);
    
    if (existingTab) {
      setActiveTab(existingTab.id);
    } else {
      const newTab = {
        id: item.id,
        title: item.label,
        type: item.type || 'general',
        data: item
      };
      setTabs([...tabs, newTab]);
      setActiveTab(newTab.id);
    }
  };

  const handleTabClose = (tabId) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    } else if (newTabs.length === 0) {
      setActiveTab('');
    }
  };

  const handleNewTab = () => {
    const newTab = {
      id: `new-${Date.now()}`,
      title: 'New Item',
      type: 'general'
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleNewReport = () => {
    setShowLCAForm(true);
  };

  const handleComparePathways = () => {
    setShowPathwayComparison(true);
  };

  const handleLCAFormComplete = (formData) => {
    // Generate a new report from the form data
    const newReport = {
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

  const handleClosePathwayComparison = () => {
    setShowPathwayComparison(false);
  };

  const handleViewReport = (reportId) => {
    console.log('Viewing report:', reportId);
    // Here you would implement report viewing functionality
    const report = reports.find(r => r.id === reportId);
    if (report) {
      // Create a tab for this report
      handleItemSelect({
        id: report.id,
        label: report.name,
        type: 'report',
        data: report
      });
    }
  };

  const handleViewDetailedResults = (formData, insights) => {
    // Create a report if not already in reports list
    let report = reports.find(r => 
      r.formData && r.formData.metalType === formData.metalType
    );
    
    if (!report) {
      report = {
        id: Date.now().toString(),
        name: `LCA for ${formData.metalType || 'Metal'}`,
        metalType: formData.metalType || 'Unknown',
        createdDate: new Date().toLocaleDateString(),
        status: 'Completed',
        co2Impact: formData.globalWarmingPotential ? 
          `${formData.globalWarmingPotential} kg CO₂-eq` : 'Not calculated',
        formData: formData
      };
      setReports([report, ...reports]);
    }
    
    setCurrentReport(report);
    setCurrentInsights(insights);
    setCurrentPage('results');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  // Render login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render LCA form if showing form
  if (showLCAForm) {
    return (
      <LCAForm 
        onComplete={handleLCAFormComplete}
        onCancel={handleLCAFormCancel}
      />
    );
  }

  if (showPathwayComparison) {
    return (
      <PathwayComparisonModal 
        onClose={handleClosePathwayComparison}
      />
    );
  }

  // Render main application UI
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
                onComparePathways={handleComparePathways}
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

      {currentPage === 'results' && currentReport && (
        <LCAResultsPage
          formData={currentReport.formData}
          insights={currentInsights}
          onBack={handleBackToDashboard}
          onExport={(format) => console.log(`Export in ${format} format requested`)}
        />
      )}
    </div>
  );
}

export default App;