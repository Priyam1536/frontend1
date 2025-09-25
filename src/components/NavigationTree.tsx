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

interface NavigationTreeProps {
  onItemSelect: (item: any) => void;
}

const NavigationTree: React.FC<NavigationTreeProps> = ({ onItemSelect }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['projects', 'processes', 'flows']));

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

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (node: any, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const Icon = node.icon;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded transition-colors`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            } else {
              onItemSelect(node);
            }
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500 mr-1" />
            )
          ) : (
            <div className="w-5 mr-1" />
          )}
          <Icon className="h-4 w-4 text-gray-600 mr-2" />
          <span className="text-sm text-gray-800 select-none">{node.label}</span>
          {hasChildren && (
            <span className="ml-auto text-xs text-gray-400">
              ({node.children.length})
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child: any) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm">Navigation</h3>
      </div>
      <div className="p-2">
        {treeData.map((node) => renderTreeNode(node))}
      </div>
    </div>
  );
};

export default NavigationTree;