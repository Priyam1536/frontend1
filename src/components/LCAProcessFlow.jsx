import React, { useState, useRef, useEffect } from 'react';
import { 
  Mountain,
  Factory, 
  Truck, 
  Timer, 
  Recycle, 
  LayoutGrid,
  Zap
} from 'lucide-react';

const LCAProcessFlow = ({ currentStep = 1, formData = {} }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);
  const startPosRef = useRef(null);

  // Define the nodes for the LCA process
  const nodes = [
    { id: 1, name: 'Metal Information', icon: LayoutGrid, x: 150, y: 150, step: 1 },
    { id: 2, name: 'Mining & Extraction', icon: Mountain, x: 300, y: 100, step: 2 },
    { id: 3, name: 'Processing', icon: Factory, x: 450, y: 150, step: 3 },
    { id: 4, name: 'Transport', icon: Truck, x: 600, y: 200, step: 4 },
    { id: 5, name: 'Use Phase', icon: Timer, x: 450, y: 250, step: 5 },
    { id: 6, name: 'End of Life', icon: Recycle, x: 300, y: 300, step: 6 },
    { id: 7, name: 'Impact Metrics', icon: Zap, x: 150, y: 250, step: 7 },
  ];

  // Define connections between nodes
  const connections = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 7, to: 1 }, // Complete the cycle
  ];

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('g') || !containerRef.current || !containerRef.current.contains(e.target)) return;
    setIsDragging(true);
    startPosRef.current = { 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    };
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPosRef.current.x,
      y: e.clientY - startPosRef.current.y
    });
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse wheel for zooming
  const handleWheel = (e) => {
    if (!containerRef.current || !containerRef.current.contains(e.target)) return;
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.001;
    setZoom(Math.min(Math.max(0.5, newZoom), 2));
  };

  // Handle node click
  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    setSelectedNode(selectedNode === node.id ? null : node.id);
  };

  // Get summary information for the selected node
  const getNodeSummary = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;
    
    // Safety check for formData
    if (!formData) return { title: node.name, details: [] };
    
    switch(node.step) {
      case 1:
        return {
          title: 'Metal Information',
          details: [
            { label: 'Metal Type', value: formData.metalType || 'Not specified' },
            { label: 'Mining Location', value: formData.miningLocation || 'Not specified' },
            { label: 'Ore Grade', value: formData.oreGrade ? `${formData.oreGrade}%` : 'Not specified' },
            { label: 'Production Volume', value: formData.productionVolume ? `${formData.productionVolume} tonnes` : 'Not specified' }
          ]
        };
      case 2:
        return {
          title: 'Mining & Extraction',
          details: [
            { label: 'Energy Consumption', value: formData.energyConsumptionMining ? `${formData.energyConsumptionMining} MJ/tonne` : 'Not specified' },
            { label: 'Water Consumption', value: formData.waterConsumptionMining ? `${formData.waterConsumptionMining} m³/tonne` : 'Not specified' },
            { label: 'Land Use', value: formData.landUse ? `${formData.landUse} m²/tonne` : 'Not specified' }
          ]
        };
      case 3:
        return {
          title: 'Processing',
          details: [
            { label: 'Energy Source', value: formData.energySource || 'Not specified' },
            { label: 'Processing Route', value: formData.processingRoute || 'Not specified' },
            { label: 'Recovery Rate', value: formData.recoveryRate ? `${formData.recoveryRate}%` : 'Not specified' }
          ]
        };
      case 4:
        return {
          title: 'Transport',
          details: [
            { label: 'Transport Mode', value: formData.transportMode || 'Not specified' },
            { label: 'Transport Distance', value: formData.transportDistances ? `${formData.transportDistances} km` : 'Not specified' }
          ]
        };
      case 5:
        return {
          title: 'Use Phase',
          details: [
            { label: 'Product Lifetime', value: formData.productLifetime ? `${formData.productLifetime} years` : 'Not specified' }
          ]
        };
      case 6:
        return {
          title: 'End of Life',
          details: [
            { label: 'Recycling Rate', value: formData.recyclingRate ? `${formData.recyclingRate}%` : 'Not specified' },
            { label: 'Reuse Rate', value: formData.reuseRate ? `${formData.reuseRate}%` : 'Not specified' },
            { label: 'Disposal Route', value: formData.disposalRoute || 'Not specified' }
          ]
        };
      case 7:
        return {
          title: 'Impact Metrics',
          details: [
            { label: 'Global Warming Potential', value: formData.globalWarmingPotential ? `${formData.globalWarmingPotential} kg CO₂-eq` : 'Not specified' },
            { label: 'Water Scarcity Footprint', value: formData.waterScarcityFootprint ? `${formData.waterScarcityFootprint} m³-eq` : 'Not specified' },
            { label: 'Energy Demand', value: formData.cumulativeEnergyDemand ? `${formData.cumulativeEnergyDemand} MJ` : 'Not specified' }
          ]
        };
      default:
        return {
          title: node.name,
          details: [{ label: 'Status', value: 'No data available' }]
        };
    }
  };

  // Add event listeners
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const handleWheelEvent = (e) => handleWheel(e);
    
    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
    };
  }, [zoom]); // Include zoom in dependencies

  const nodeSummary = selectedNode ? getNodeSummary(selectedNode) : null;

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '400px' }}>
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden cursor-grab"
        style={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Background to ensure drag works */}
          <rect 
            x="0" 
            y="0" 
            width="800" 
            height="400" 
            fill="transparent" 
            pointerEvents="all" 
          />
          
          {/* Draw connections */}
          {connections.map(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={`${conn.from}-${conn.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={fromNode.step === currentStep || toNode.step === currentStep ? "#8B5CF6" : "#4B5563"}
                strokeWidth="2"
                strokeDasharray={toNode.step > currentStep ? "5,5" : "none"}
              />
            );
          })}
          
          {/* Draw nodes */}
          {nodes.map(node => {
            const isActive = node.step === currentStep;
            const isCompleted = node.step < currentStep;
            const isPending = node.step > currentStep;
            const isSelected = node.id === selectedNode;
            
            const NodeIcon = node.icon;
            
            return (
              <g 
                key={node.id} 
                onClick={(e) => handleNodeClick(e, node)} 
                style={{ cursor: 'pointer' }}
                pointerEvents="all"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 30 : isActive ? 25 : 20}
                  fill={
                    isSelected ? "#8B5CF6" :
                    isActive ? "#6366F1" :
                    isCompleted ? "#10B981" : 
                    "#4B5563"
                  }
                  stroke={isSelected ? "#F3F4F6" : "none"}
                  strokeWidth="3"
                  opacity={isPending ? 0.6 : 1}
                  className="transition-all duration-200"
                />
                <foreignObject
                  x={node.x - 12}
                  y={node.y - 12}
                  width="24"
                  height="24"
                  pointerEvents="none"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <NodeIcon className="w-5 h-5 text-white" />
                  </div>
                </foreignObject>
                
                <text
                  x={node.x}
                  y={node.y + 45}
                  textAnchor="middle"
                  fill="#E5E7EB"
                  fontSize="12"
                  fontWeight={isActive ? "bold" : "normal"}
                  pointerEvents="none"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-xs text-gray-400 text-center">
        Drag to pan • Scroll to zoom • Click nodes for details
      </div>
      
      {/* Node details */}
      {nodeSummary && (
        <div className="absolute top-4 right-4 w-72 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg border border-purple-500 text-white">
          <h3 className="text-lg font-medium mb-2">{nodeSummary.title}</h3>
          <div className="space-y-2">
            {nodeSummary.details.map((detail, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-300">{detail.label}:</span>
                <span className="font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
          <button 
            className="mt-3 text-xs text-purple-300 hover:text-purple-200"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNode(null);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default LCAProcessFlow;
