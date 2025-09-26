import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import ProcessEditor from './editors/ProcessEditor.jsx';
import FlowEditor from './editors/FlowEditor.jsx';
import ProjectEditor from './editors/ProjectEditor.jsx';
import SystemEditor from './editors/SystemEditor.jsx';

const EditorArea = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  onTabClose, 
  onNewTab 
}) => {
  const renderEditor = (tab) => {
    switch (tab.type) {
      case 'process':
        return <ProcessEditor data={tab.data} />;
      case 'flow':
        return <FlowEditor data={tab.data} />;
      case 'project':
        return <ProjectEditor data={tab.data} />;
      case 'system':
        return <SystemEditor data={tab.data} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Welcome to OreSense AI</h3>
              <p>Select an item from the navigation tree to start editing</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b border-gray-200 bg-gray-50">
        <div className="flex-1 flex overflow-x-auto">
          {tabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center px-4 py-2 border-r border-gray-200 cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 border-b-2 border-b-blue-500' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="truncate max-w-xs">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button 
          onClick={onNewTab}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100"
          title="New Tab"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto bg-white p-4">
        {activeTab ? renderEditor(tabs.find(tab => tab.id === activeTab)) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Active Tab</h3>
              <p>Select a tab or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorArea;