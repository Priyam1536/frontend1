import React, { useState } from 'react';
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react';

interface ConsolePanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

const ConsolePanel: React.FC<ConsolePanelProps> = ({ isVisible, onToggle }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const logs = [
    { time: '14:32:15', level: 'INFO', message: 'Starting LCA calculation...' },
    { time: '14:32:16', level: 'INFO', message: 'Loading process data: Silicon Purification' },
    { time: '14:32:17', level: 'INFO', message: 'Loading process data: Transportation' },
    { time: '14:32:18', level: 'WARNING', message: 'Missing emission factor for process: Transportation' },
    { time: '14:32:19', level: 'INFO', message: 'Building system matrix...' },
    { time: '14:32:20', level: 'INFO', message: 'Solving linear system...' },
    { time: '14:32:21', level: 'SUCCESS', message: 'Calculation completed successfully' },
    { time: '14:32:22', level: 'INFO', message: 'Results available in Results panel' }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600';
      case 'WARNING':
        return 'text-yellow-600';
      case 'SUCCESS':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-gray-900 text-gray-100 border-t border-gray-700 ${isMinimized ? 'h-10' : 'h-48'} transition-all duration-200`}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4" />
          <span className="text-sm font-medium">Console</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="h-full overflow-y-auto p-2 text-sm font-mono">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start space-x-3 py-1">
              <span className="text-gray-400 text-xs">{log.time}</span>
              <span className={`text-xs font-semibold ${getLevelColor(log.level)} min-w-[60px]`}>
                {log.level}
              </span>
              <span className="text-gray-200">{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsolePanel;