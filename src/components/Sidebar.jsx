import React from 'react';
import { 
  BarChart3, 
  Database, 
  FileText, 
  Settings, 
  Zap, 
  FolderOpen,
  GitBranch,
  TrendingUp,
  Brain
} from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'processes', label: 'Processes', icon: GitBranch },
    { id: 'impact', label: 'Impact Assessment', icon: TrendingUp },
    { id: 'database', label: 'Database', icon: Database },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">OreSense AI</h2>
            <p className="text-sm text-gray-500">LCA Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-800">AI Assistant</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Get intelligent insights for your LCA projects</p>
            <button className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium py-2 px-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200">
              Ask AI
            </button>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;