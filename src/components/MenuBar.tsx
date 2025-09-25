import React, { useState } from 'react';
import { ChevronDown, FileText, Download, Upload, Database, LogOut, Undo, Redo, Copy, Cast as Paste, Settings, Eye, Navigation, Play, Calculator, BarChart3, Shuffle, TrendingUp, AppWindow as Window, HelpCircle, BookOpen, Info, RefreshCw } from 'lucide-react';

interface MenuBarProps {
  onMenuAction: (action: string) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onMenuAction }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems = [
    {
      label: 'File',
      items: [
        { label: 'New Project', icon: FileText, action: 'new-project' },
        { type: 'separator' },
        { label: 'Import Data', icon: Upload, action: 'import-data' },
        { label: 'Export Data', icon: Download, action: 'export-data' },
        { type: 'separator' },
        { label: 'Exit', icon: LogOut, action: 'exit' }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', icon: Undo, action: 'undo', shortcut: 'Ctrl+Z' },
        { label: 'Redo', icon: Redo, action: 'redo', shortcut: 'Ctrl+Y' },
        { type: 'separator' },
        { label: 'Copy', icon: Copy, action: 'copy', shortcut: 'Ctrl+C' },
        { label: 'Paste', icon: Paste, action: 'paste', shortcut: 'Ctrl+V' },
        { type: 'separator' },
        { label: 'Preferences', icon: Settings, action: 'preferences' }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Show Navigation', icon: Eye, action: 'show-navigation' },
        { label: 'Show Results', icon: Eye, action: 'show-results' },
        { type: 'separator' },
        { label: 'Reset Layout', icon: RefreshCw, action: 'reset-layout' }
      ]
    },
    {
      label: 'Navigate',
      items: [
        { label: 'Go to Process', icon: Navigation, action: 'goto-process' },
        { label: 'Go to Flow', icon: Navigation, action: 'goto-flow' },
        { label: 'Go to Product System', icon: Navigation, action: 'goto-system' }
      ]
    },
    {
      label: 'Run',
      items: [
        { label: 'LCA Calculation', icon: Calculator, action: 'run-lca' },
        { label: 'Generate Report', icon: BarChart3, action: 'generate-report' }
      ]
    },
    {
      label: 'Window',
      items: [
        { label: 'Modeling Perspective', icon: Window, action: 'perspective-modeling' },
        { label: 'Analysis Perspective', icon: Window, action: 'perspective-analysis' }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'Documentation', icon: BookOpen, action: 'help-docs' },
        { label: 'About OreSense AI', icon: Info, action: 'help-about' },
        { label: 'Check for Updates', icon: RefreshCw, action: 'help-update' }
      ]
    }
  ];

  const handleMenuClick = (menuLabel: string) => {
    setActiveMenu(activeMenu === menuLabel ? null : menuLabel);
  };

  const handleItemClick = (action: string) => {
    onMenuAction(action);
    setActiveMenu(null);
  };

  return (
    <div className="bg-white border-b border-gray-200 relative z-50">
      <div className="flex items-center px-4 py-1">
        {menuItems.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              onClick={() => handleMenuClick(menu.label)}
              className={`px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-colors flex items-center space-x-1 ${
                activeMenu === menu.label ? 'bg-gray-100' : ''
              }`}
            >
              <span>{menu.label}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            
            {activeMenu === menu.label && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                {menu.items.map((item, index) => (
                  item.type === 'separator' ? (
                    <div key={index} className="border-t border-gray-100 my-1" />
                  ) : (
                    <button
                      key={index}
                      onClick={() => handleItemClick(item.action)}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.shortcut && (
                        <span className="text-xs text-gray-400">{item.shortcut}</span>
                      )}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuBar;