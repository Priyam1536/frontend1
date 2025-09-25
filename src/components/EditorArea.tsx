import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import ProcessEditor from './editors/ProcessEditor';
import FlowEditor from './editors/FlowEditor';
import ProjectEditor from './editors/ProjectEditor';
import SystemEditor from './editors/SystemEditor';

interface Tab {
  id: string;
  title: string;
  type: string;
  data?: any;
}

interface EditorAreaProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
}

const EditorArea: React.FC<EditorAreaProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  onTabClose, 
  onNewTab 
}) => {
  const renderEditor = (tab: Tab) => {
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

  if (tabs.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No editors open</h3>
          <p className="text-gray-600 mb-4">Double-click an item in the navigation tree to open it</p>
          <button
            onClick={onNewTab}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 border-r border-gray-200 cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-white border-b-2 border-blue-600 text-blue-600'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="text-sm font-medium mr-2">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            onClick={onNewTab}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="New Tab"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`h-full ${activeTab === tab.id ? 'block' : 'hidden'}`}
          >
            {renderEditor(tab)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorArea;