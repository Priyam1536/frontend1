import React, { useState, useRef, useEffect } from 'react';
import { 
  Mountain,
  Factory, 
  Truck, 
  Timer, 
  Recycle, 
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

const LCAProcessFlow = ({ currentStep, formData }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const containerRef = useRef(null);
  const startPosRef = useRef(null);
  const animationRef = useRef(null);
  const isInitialRender = useRef(true);

  // Modern node positions with equidistant circular layout
  const centerX = 400;
  const centerY = 300;
  const radius = 170;
  const impactRadius = 80;
  
  // Calculate node positions in a circular layout
  const calculateNodePosition = (index, totalNodes) => {
    // Start from the top (270 degrees in unit circle, -90 in SVG)
    const angle = (index / totalNodes) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Create nodes with calculated positions
  const mainNodes = [
    { id: 1, name: 'Raw Material', icon: Mountain, step: 1, color: '#3B82F6', gradient: ['#3B82F6', '#2563EB'] }, // Blue
    { id: 2, name: 'Processing', icon: Factory, step: 2, color: '#10B981', gradient: ['#10B981', '#059669'] }, // Green
    { id: 3, name: 'Manufacturing', icon: Factory, step: 3, color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED'] }, // Purple
    { id: 4, name: 'Distribution', icon: Truck, step: 4, color: '#F59E0B', gradient: ['#F59E0B', '#D97706'] }, // Amber
    { id: 5, name: 'Use Phase', icon: Timer, step: 5, color: '#EC4899', gradient: ['#EC4899', '#DB2777'] }, // Pink
    { id: 6, name: 'End of Life', icon: Recycle, step: 6, color: '#6366F1', gradient: ['#6366F1', '#4F46E5'] }, // Indigo
  ];

  // Assign positions to nodes
  const nodes = mainNodes.map((node, index) => {
    const position = calculateNodePosition(index, mainNodes.length);
    return { ...node, x: position.x, y: position.y };
  });

  // Add central impact analysis node
  nodes.push({ 
    id: 7, 
    name: 'Impact Analysis', 
    icon: Zap, 
    x: centerX, 
    y: centerY, 
    step: 7, 
    color: '#EF4444', 
    gradient: ['#EF4444', '#DC2626'] // Red
  });

  // Define connections between nodes
  const connections = [
    // Main cycle connections
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 1, isRecycling: true },
    
    // Impact analysis connections (bidirectional)
    { from: 7, to: 1, isImpact: true },
    { from: 7, to: 2, isImpact: true },
    { from: 7, to: 3, isImpact: true },
    { from: 7, to: 4, isImpact: true },
    { from: 7, to: 5, isImpact: true },
    { from: 7, to: 6, isImpact: true },
    { from: 1, to: 7, isDataFlow: true },
    { from: 2, to: 7, isDataFlow: true },
    { from: 3, to: 7, isDataFlow: true },
    { from: 4, to: 7, isDataFlow: true },
    { from: 5, to: 7, isDataFlow: true },
    { from: 6, to: 7, isDataFlow: true },
  ];
  
  // Auto-rotation animation effect
  useEffect(() => {
    if (!autoRotate) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let startTime;
    const rotationSpeed = 0.00005; // Adjust for faster/slower rotation

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      
      // Calculate rotation angle based on elapsed time
      const rotationAngle = elapsedTime * rotationSpeed;
      
      // Update nodes' positions
      nodes.forEach((node, index) => {
        if (node.id !== 7) { // Skip the central node
          const originalPosition = calculateNodePosition(index / mainNodes.length + rotationAngle, 1);
          node.x = originalPosition.x;
          node.y = originalPosition.y;
        }
      });
      
      // Force re-render
      setPosition(prev => ({ ...prev }));
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [autoRotate]);

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
      
      const container = containerRef.current;
      const { clientWidth, clientHeight } = container;
      
      // Center the visualization in the container
      const centerX = (clientWidth / 2) - (400 * zoom);
      const centerY = (clientHeight / 2) - (305 * zoom);
      
      setPosition({ x: centerX, y: centerY });
    };
    
    // Center immediately when component mounts
    centerVisualization();
    
    // Center again after a short delay to ensure container is fully rendered
    const timer = setTimeout(() => {
      centerVisualization();
      isInitialRender.current = false;
    }, 200);
    
    return () => clearTimeout(timer);
  }, [zoom]); // Re-center when zoom changes

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isDragging || !containerRef.current) return;
      
      const { clientWidth, clientHeight } = containerRef.current;
      const centerX = (clientWidth / 2) - (400 * zoom);
      const centerY = (clientHeight / 2) - (305 * zoom);
      
      setPosition({ x: centerX, y: centerY });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
