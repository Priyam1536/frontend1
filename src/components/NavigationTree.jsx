import React, { useState } from 'react';
import { 
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Folder,
  FileText,
  GitBranch,
  Layers,
  Zap,
  Database,
  Users,
  BookOpen,
  Target,
  Settings as SettingsIcon
} from 'lucide-react';

const NavigationTree = ({ onItemSelect }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['projects', 'processes', 'flows']));

  const treeData = [
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen,
      children: [
        { id: 'solar-project', label: 'Solar Panel LCA Study', icon: FileText, type: 'project' },
        { id: 'battery-project', label: 'EV Battery Analysis', icon: FileText, type: 'project' }
      ]
    },
    {
      id: 'product-systems',
      label: 'Product Systems',
      icon: GitBranch,
      children: [
        { id: 'solar-system', label: 'Solar Panel System', icon: GitBranch, type: 'system' },
        { id: 'battery-system', label: 'Battery Production System', icon: GitBranch, type: 'system' }
      ]
    },
    {
      id: 'processes',
      label: 'Processes',
      icon: Layers,
      children: [
        { id: 'silicon-purification', label: 'Silicon Purification', icon: Layers, type: 'process' },
        { id: 'cell-assembly', label: 'Battery Cell Assembly', icon: Layers, type: 'process' },
        { id: 'transport', label: 'Transportation', icon: Layers, type: 'process' },
        { id: 'recycling', label: 'End-of-Life Recycling', icon: Layers, type: 'process' }
      ]
    },
    {
      id: 'flows',
      label: 'Flows',
      icon: Zap,
      children: [
        { id: 'electricity', label: 'Electricity, grid mix', icon: Zap, type: 'flow' },
        { id: 'co2', label: 'Carbon dioxide, fossil', icon: Zap, type: 'flow' },
        { id: 'silicon', label: 'Silicon, purified', icon: Zap, type: 'flow' },
        { id: 'lithium', label: 'Lithium carbonate', icon: Zap, type: 'flow' }
      ]
    },
    {
      id: 'parameters',
      label: 'Parameters',
      icon: SettingsIcon,
      children: [
        { id: 'global-params', label: 'Global Parameters', icon: SettingsIcon, type: 'parameter' },
        { id: 'local-params', label: 'Local Parameters', icon: SettingsIcon, type: 'parameter' }
      ]
    },
    {
      id: 'lca-assessments',
      label: 'LCA Assessments',
      icon: FileText,
      children: []
    }
  ];

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const Icon = node.icon;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center px-2 py-1 hover:bg-blue-50 cursor-pointer ${
            level > 0 ? 'ml-4' : ''
          }`}
        >
          {hasChildren ? (
            <button 
              onClick={() => toggleNode(node.id)}
              className="p-1 mr-1 rounded-sm hover:bg-blue-100"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-5 mr-1" />
          )}
          
          {Icon && (
            <Icon className={`h-4 w-4 mr-2 ${!node.type ? 'text-blue-500' : 'text-gray-500'}`} />
          )}
          
          <span 
            className="text-sm"
            onClick={() => hasChildren ? toggleNode(node.id) : onItemSelect(node)}
          >
            {node.label}
          </span>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="border-l border-gray-200 ml-2.5">
            {node.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto bg-white border-r border-gray-200">
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm">OreSense Navigator</h3>
        <div className="mt-3">
          {treeData.map(node => renderTreeNode(node))}
        </div>
      </div>
    </div>
  );
};

export default NavigationTree;