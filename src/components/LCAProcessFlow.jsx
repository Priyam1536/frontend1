import React, { useState, useRef, useEffect } from 'react';
import { 
  Mountain,
  Factory, 
  Truck, 
  Timer, 
  Recycle, 
  LayoutGrid,
  Zap,
  ArrowRight,
  Info
} from 'lucide-react';

const LCAProcessFlow = ({ currentStep, formData }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2); // Adjusted zoom level for better initial view
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef(null);
  const startPosRef = useRef(null);
  const isInitialRender = useRef(true);

  // Adjusted node positions with more space between them
  const nodes = [
    { id: 1, name: 'Material Extraction', icon: Mountain, x: 400, y: 130, step: 1, color: '#3B82F6' }, // Blue
    { id: 2, name: 'Processing', icon: Factory, x: 620, y: 230, step: 3, color: '#10B981' }, // Green - moved further right
    { id: 3, name: 'Manufacturing', icon: Factory, x: 620, y: 380, step: 3, color: '#8B5CF6' }, // Purple - moved further right
    { id: 4, name: 'Distribution', icon: Truck, x: 400, y: 480, step: 4, color: '#F59E0B' }, // Amber - moved further down
    { id: 5, name: 'Use Phase', icon: Timer, x: 180, y: 380, step: 5, color: '#EC4899' }, // Pink - moved further left
    { id: 6, name: 'End of Life', icon: Recycle, x: 180, y: 230, step: 6, color: '#6366F1' }, // Indigo - moved further left
    { id: 7, name: 'Impact Analysis', icon: Zap, x: 400, y: 305, step: 7, color: '#EF4444' }, // Red
  ];

  // Define connections between nodes to create a circular flow
  const connections = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 1, isRecycling: true },
    { from: 7, to: 1 },
    { from: 7, to: 2 },
    { from: 7, to: 3 },
    { from: 7, to: 4 },
    { from: 7, to: 5 },
    { from: 7, to: 6 },
  ];

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('g') || !containerRef.current) return;
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
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.001;
    setZoom(Math.min(Math.max(0.5, newZoom), 2));
  };

  // Handle node click
  const handleNodeClick = (nodeId) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  // Get summary information for the selected node
  const getNodeSummary = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;
    
    switch(node.id) {
      case 1:
        return {
          title: 'Material Extraction',
          details: [
            { label: 'Metal Type', value: formData.metalType || 'Not specified' },
            { label: 'Mining Location', value: formData.miningLocation || 'Not specified' },
            { label: 'Ore Grade', value: formData.oreGrade ? `${formData.oreGrade}%` : 'Not specified' },
            { label: 'Land Use', value: formData.landUse ? `${formData.landUse} m²/tonne` : 'Not specified' }
          ],
          circularOpportunities: 'Optimize extraction to minimize waste and use recycled input when possible.',
          environmentalImpacts: 'Land disturbance, habitat loss, energy use, water consumption.'
        };
      case 2:
        return {
          title: 'Processing',
          details: [
            { label: 'Energy Source', value: formData.energySource || 'Not specified' },
            { label: 'Energy Consumption', value: formData.energyConsumptionProcessing ? `${formData.energyConsumptionProcessing} MJ/tonne` : 'Not specified' },
            { label: 'Recovery Rate', value: formData.recoveryRate ? `${formData.recoveryRate}%` : 'Not specified' }
          ],
          circularOpportunities: 'Recover process heat, utilize by-products, implement closed-loop water systems.',
          environmentalImpacts: 'Air emissions, water pollution, energy consumption, chemical waste.'
        };
      case 3:
        return {
          title: 'Manufacturing',
          details: [
            { label: 'Processing Route', value: formData.processingRoute || 'Not specified' },
            { label: 'Recycled Input Rate', value: formData.recycledInputRate ? `${formData.recycledInputRate}%` : 'Not specified' }
          ],
          circularOpportunities: 'Design for disassembly, use recycled materials, minimize scrap and waste.',
          environmentalImpacts: 'Resource consumption, energy use, process emissions, waste generation.'
        };
      case 4:
        return {
          title: 'Distribution',
          details: [
            { label: 'Transport Mode', value: formData.transportMode || 'Not specified' },
            { label: 'Transport Distance', value: formData.transportDistances ? `${formData.transportDistances} km` : 'Not specified' },
            { label: 'Packaging', value: formData.packaging || 'Not specified' }
          ],
          circularOpportunities: 'Optimize routes, use returnable packaging, employ low-carbon transport.',
          environmentalImpacts: 'Fuel consumption, greenhouse gas emissions, packaging waste.'
        };
      case 5:
        return {
          title: 'Use Phase',
          details: [
            { label: 'Product Lifetime', value: formData.productLifetime ? `${formData.productLifetime} years` : 'Not specified' }
          ],
          circularOpportunities: 'Design for longevity, enable repair and upgradeability, facilitate sharing models.',
          environmentalImpacts: 'Energy consumption during use, wear and tear, maintenance impacts.'
        };
      case 6:
        return {
          title: 'End of Life',
          details: [
            { label: 'Recycling Rate', value: formData.recyclingRate ? `${formData.recyclingRate}%` : 'Not specified' },
            { label: 'Reuse Rate', value: formData.reuseRate ? `${formData.reuseRate}%` : 'Not specified' },
            { label: 'Disposal Route', value: formData.disposalRoute || 'Not specified' }
          ],
          circularOpportunities: 'Enhance collection systems, improve sorting technology, develop recycling infrastructure.',
          environmentalImpacts: 'Landfill use, incineration emissions, resource loss if not recycled.'
        };
      case 7:
        return {
          title: 'Impact Analysis',
          details: [
            { label: 'Global Warming Potential', value: formData.globalWarmingPotential ? `${formData.globalWarmingPotential} kg CO₂-eq` : 'Not specified' },
            { label: 'Water Scarcity', value: formData.waterScarcityFootprint ? `${formData.waterScarcityFootprint} m³-eq` : 'Not specified' },
            { label: 'Energy Demand', value: formData.cumulativeEnergyDemand ? `${formData.cumulativeEnergyDemand} MJ` : 'Not specified' }
          ],
          circularOpportunities: 'Identify hotspots for intervention, quantify benefits of circular strategies.',
          environmentalImpacts: 'Provides metrics for climate change, resource depletion, ecosystem impacts.'
        };
      default:
        return {
          title: 'Information Not Available',
          details: []
        };
    }
  };

  // Center the visualization when component mounts
  useEffect(() => {
    const centerVisualization = () => {
      if (!containerRef.current) return;
      
      const { clientWidth, clientHeight } = containerRef.current;
      
      // Center horizontally and vertically with proper offsets
      const centerX = (clientWidth / 2) - (400 * zoom);
      const centerY = (clientHeight / 2) - (305 * zoom);
      
      setPosition({ x: centerX, y: centerY });
    };

    // Center on initial render and if container or zoom changes
    if (isInitialRender.current) {
      // Use a small timeout to ensure the container has been properly sized
      const timer = setTimeout(() => {
        centerVisualization();
        isInitialRender.current = false;
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [zoom]);

  // Handle window resize to keep visualization centered
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || isDragging) return;
      
      const { clientWidth, clientHeight } = containerRef.current;
      const centerX = (clientWidth / 2) - (400 * zoom);
      const centerY = (clientHeight / 2) - (305 * zoom);
      
      setPosition({ x: centerX, y: centerY });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [zoom, isDragging]);

  // Add event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [zoom]);

  const nodeSummary = selectedNode ? getNodeSummary(selectedNode) : null;

  return (
    <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200" style={{ height: '500px' }}>
      <div className="absolute top-2 left-2 right-2 text-center">
        <p className="text-sm text-gray-600 italic mb-1">
          
        </p>
        <button 
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="w-3 h-3 mr-1" />
          {showInfo ? 'Hide information' : 'Learn more'}
        </button>
        
        {showInfo && (
          <div className="absolute top-full left-0 right-0 bg-white p-3 border border-gray-200 rounded-md shadow-md z-20 text-left mt-1">
            <p className="text-xs text-gray-700 mb-2">
              <span className="font-semibold">How to use this visualization:</span> Click on any node to see detailed information about that stage of the lifecycle, including environmental impacts and circular economy opportunities.
            </p>
            <p className="text-xs text-gray-700">
              The green recycling flow represents material recovery and reuse pathways that close the loop between end-of-life and raw material stages, reducing virgin resource extraction.
            </p>
          </div>
        )}
      </div>
      
      <div 
        ref={containerRef}
        className="absolute inset-0 overflow-hidden cursor-grab pt-12"
        style={{ touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Draw connections */}
          {connections.map(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            
            if (!fromNode || !toNode) return null;
            
            // Calculate control points for curved paths
            let controlPoints = {};
            
            if (conn.isRecycling) {
              // Make recycling connection more curved and distinctive
              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;
              const offsetX = (toNode.y - fromNode.y) * 0.8;
              const offsetY = (fromNode.x - toNode.x) * 0.8;
              
              controlPoints = {
                x1: midX + offsetX,
                y1: midY + offsetY
              };
              
              // Draw a curved path for recycling connection
              const path = `M ${fromNode.x} ${fromNode.y} Q ${controlPoints.x1} ${controlPoints.y1}, ${toNode.x} ${toNode.y}`;
              
              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray="none"
                    className="transition-all duration-300"
                    markerEnd="url(#arrowheadGreen)"
                  />
                  <text>
                    <textPath
                      href={`#recycling-path-${conn.from}-${conn.to}`}
                      startOffset="50%"
                      textAnchor="middle"
                      className="text-xs fill-green-600 font-medium"
                      dy="-6"
                    >
                      Recycled Materials
                    </textPath>
                  </text>
                  <path
                    id={`recycling-path-${conn.from}-${conn.to}`}
                    d={path}
                    fill="none"
                    stroke="none"
                  />
                </g>
              );
            } else if (conn.from === 7) {
              // Special connection for impact analysis node
              return (
                <line
                  key={`${conn.from}-${conn.to}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeDasharray="4"
                  opacity="0.6"
                  className="transition-all duration-300"
                />
              );
            } else {
              // Normal connections between sequential nodes
              const isActive = fromNode.step === currentStep || toNode.step === currentStep;
              const color = isActive ? fromNode.color : "#94a3b8";
              
              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={color}
                    strokeWidth={isActive ? "3" : "2"}
                    strokeDasharray="none"
                    className="transition-all duration-300"
                    markerEnd={`url(#arrowhead${isActive ? "Active" : ""})`}
                  />
                </g>
              );
            }
          })}

          {/* Define arrowhead markers */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
            <marker
              id="arrowheadActive"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
            </marker>
            <marker
              id="arrowheadGreen"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#10B981" />
            </marker>
          </defs>
          
          {/* Draw nodes with larger icons */}
          {nodes.map(node => {
            const isActive = node.step === currentStep;
            const isSelected = node.id === selectedNode;
            const isImpactNode = node.id === 7;
            
            const NodeIcon = node.icon;
            
            return (
              <g 
                key={node.id} 
                onClick={() => handleNodeClick(node.id)} 
                style={{ cursor: 'pointer' }}
                className="transition-transform duration-200 hover:scale-110"
              >
                {isImpactNode ? (
                  // Special styling for the central "Impact Analysis" node
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="50" // Further increased radius
                    fill="white"
                    stroke={node.color}
                    strokeWidth={isSelected ? "4" : "3"}
                    strokeDasharray={isSelected ? "none" : "5,3"}
                    className="transition-all duration-300"
                  />
                ) : (
                  // Regular nodes
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="50" // Further increased radius
                    fill="white"
                    stroke={node.color}
                    strokeWidth={isSelected || isActive ? "4" : "3"}
                    className="transition-all duration-300"
                    filter={isSelected ? "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))" : "none"}
                  />
                )}
                
                <foreignObject
                  x={node.x - 30} // Adjusted for larger icon
                  y={node.y - 30} // Adjusted for larger icon
                  width="60"      // Further increased width
                  height="60"     // Further increased height
                  style={{ pointerEvents: 'none' }}
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <NodeIcon 
                      className="w-10 h-10" // Further increased icon size
                      style={{ color: isActive || isSelected ? node.color : '#64748b' }} 
                    />
                  </div>
                </foreignObject>
                
                <text
                  x={node.x}
                  y={node.y + 75} // Moved text further from node
                  textAnchor="middle"
                  fill="#334155"
                  fontWeight={isActive || isSelected ? "600" : "500"}
                  fontSize="16"
                  style={{ pointerEvents: 'none' }}
                  className="transition-all duration-300"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Node details with improved visibility */}
      {nodeSummary && (
        <div className="absolute top-4 right-4 w-80 bg-white p-5 rounded-lg shadow-lg border border-gray-200 z-10">
          <h3 className="text-xl font-medium mb-3" style={{ color: nodes.find(n => n.id === selectedNode)?.color || '#3B82F6' }}>
            {nodeSummary.title}
          </h3>
          
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Details</h4>
              {nodeSummary.details.map((detail, index) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{detail.label}:</span>
                  <span className="font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
            
            <div className="border-b border-gray-200 pb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Circular Opportunities</h4>
              <p className="text-sm text-gray-600">{nodeSummary.circularOpportunities}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Environmental Impacts</h4>
              <p className="text-sm text-gray-600">{nodeSummary.environmentalImpacts}</p>
            </div>
          </div>
          
          <button 
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
            onClick={() => setSelectedNode(null)}
          >
            Close
          </button>
        </div>
      )}
      
      {/* Better visible instructions */}
      <div className="absolute bottom-3 left-3 right-3 text-sm text-gray-600 text-center bg-white bg-opacity-80 py-1 px-2 rounded-md">
        Click on nodes for details • Drag to pan • Scroll to zoom
      </div>
    </div>
  );
};

export default LCAProcessFlow;
