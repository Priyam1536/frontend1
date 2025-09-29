import React, { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings2, 
  User,
  ChevronRight,
  ChevronDown,
  GitBranch 
} from 'lucide-react';
import Logo from './Logo.jsx';

const Sidebar = ({ onItemSelect, activeItem = 'dashboard' }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Main overview and reports'
    },
    { 
      id: 'flows', 
      label: 'Flows', 
      icon: GitBranch,
      description: 'Flow templates and parameter presets'
    },
    { 
      id: 'impact-results', 
      label: 'Impact Results', 
      icon: BarChart3,
      description: 'Environmental impact analysis'
    },
    { 
      id: 'team-management', 
      label: 'Team Management', 
      icon: Users,
      description: 'User and collaborator management'
    },
    // { 
    //   id: 'parameters', 
    //   label: 'Parameters', 
    //   icon: Settings2,
    //   description: 'Model parameters and configuration'
    // },
    { 
      id: 'user-profile', 
      label: 'User Profile & Preferences', 
      icon: User,
      description: 'Personal settings and preferences'
    }
  ];

  const handleItemClick = (itemId) => {
    if (onItemSelect) {
      onItemSelect(itemId);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3 mb-2">
          <Logo size="small" />
          <h2 className="text-lg font-semibold text-gray-800">OreSense AI</h2>
        </div>
        <p className="text-xs text-gray-600">Navigation Panel</p>
      </div>
      
      {/* Navigation Menu */}
      <div className="flex-1 py-3 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <div key={item.id} className="group">
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg
                    transition-all duration-200 ease-in-out
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  `}
                  title={item.description}
                >
                  <Icon 
                    className={`
                      flex-shrink-0 mr-3 h-5 w-5 transition-colors duration-200
                      ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}
                    `}
                  />
                  <span className="flex-1 text-left truncate">
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </button>
                
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="absolute left-72 top-0 z-10 bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-nowrap">
                    {item.description}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>Version 2.0</p>
          <p className="mt-1">© 2025 OreSense AI</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
    
