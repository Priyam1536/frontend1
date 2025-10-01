import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Download, Filter, RefreshCw, FileX } from 'lucide-react';

const ImpactResults = () => {
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [timeRange, setTimeRange] = useState('year');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [impactData, setImpactData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [processBreakdown, setProcessBreakdown] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);

  // Fetch reports from localStorage or API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        
        // First try to get reports from localStorage
        const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
        
        // If we have local reports, use them
        if (savedReports.length > 0) {
          setReports(savedReports);
          calculateInsights(savedReports);
          setHasData(true);
        } else {
          // Otherwise try to fetch from API
          try {
            const token = localStorage.getItem('authToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            
            const response = await fetch('https://perfect-earliest-gsm-programmers.trycloudflare.com/api/lca/reports', { headers });
            if (!response.ok) {
              throw new Error('Failed to fetch reports from API');
            }
            
            const apiReports = await response.json();
            if (apiReports && apiReports.length > 0) {
              setReports(apiReports);
              calculateInsights(apiReports);
              setHasData(true);
            } else {
              // No reports found
              setHasData(false);
              setImpactData([]);
              setMonthlyTrends([]);
              setProcessBreakdown([]);
            }
          } catch (apiError) {
            console.error("API error:", apiError);
            // No reports found in API either
            setHasData(false);
            setImpactData([]);
            setMonthlyTrends([]);
            setProcessBreakdown([]);
          }
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try again.");
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [timeRange, selectedMetric]);

  // Calculate insights based on reports data
  const calculateInsights = (reportsData) => {
    // If we have no reports, clear all data
    if (!reportsData || reportsData.length === 0) {
      setImpactData([]);
      setMonthlyTrends([]);
      setProcessBreakdown([]);
      setHasData(false);
      return;
    }

    try {
      // Filter reports based on timeRange if needed
      const filteredReports = filterReportsByTimeRange(reportsData, timeRange);
      if (filteredReports.length === 0) {
        setImpactData([]);
        setMonthlyTrends([]);
        setProcessBreakdown([]);
        setHasData(false);
        return;
      }

      // 1. Calculate Carbon Footprint metrics
      const carbonValues = filteredReports
        .filter(r => r.formData && r.formData.globalWarmingPotential)
        .map(r => parseFloat(r.formData.globalWarmingPotential));
      
      // Industry benchmarks - in a real app these would come from API or database
      const benchmarks = {
        carbonFootprint: 3.2, // kg CO₂-eq
        waterUsage: 12.0, // L/kg
        energyConsumption: 48.0, // MJ/kg
        landUse: 0.08 // m²/kg
      };
      
      // Get previous period data for trend calculation
      const prevReports = getPreviousPeriodReports(reportsData, timeRange);
      
      // Calculate averages, trends and metrics
      const metrics = [];
      
      // Carbon Footprint
      if (carbonValues.length > 0) {
        const avgCarbonFootprint = carbonValues.reduce((sum, val) => sum + val, 0) / carbonValues.length;
        
        // Calculate trend compared to previous period
        const prevCarbonValues = prevReports
          .filter(r => r.formData && r.formData.globalWarmingPotential)
          .map(r => parseFloat(r.formData.globalWarmingPotential));
        
        const prevAvgCarbon = prevCarbonValues.length > 0 
          ? prevCarbonValues.reduce((sum, val) => sum + val, 0) / prevCarbonValues.length
          : avgCarbonFootprint;
        
        const carbonChange = prevAvgCarbon !== 0 
          ? Math.round(((avgCarbonFootprint - prevAvgCarbon) / prevAvgCarbon) * 100) 
          : 0;
        
        metrics.push({
          category: 'Carbon Footprint',
          value: avgCarbonFootprint.toFixed(2),
          unit: 'kg CO₂-eq',
          trend: carbonChange < 0 ? 'down' : carbonChange > 0 ? 'up' : 'stable',
          change: carbonChange,
          status: avgCarbonFootprint < benchmarks.carbonFootprint ? 'good' : 'warning',
          benchmark: benchmarks.carbonFootprint
        });
      }
      
      // 2. Water Usage metrics
      const waterValues = filteredReports
        .filter(r => r.formData && r.formData.waterConsumptionMining)
        .map(r => parseFloat(r.formData.waterConsumptionMining));
      
      if (waterValues.length > 0) {
        const avgWaterUsage = waterValues.reduce((sum, val) => sum + val, 0) / waterValues.length;
        
        const prevWaterValues = prevReports
          .filter(r => r.formData && r.formData.waterConsumptionMining)
          .map(r => parseFloat(r.formData.waterConsumptionMining));
        
        const prevAvgWater = prevWaterValues.length > 0
          ? prevWaterValues.reduce((sum, val) => sum + val, 0) / prevWaterValues.length
          : avgWaterUsage;
        
        const waterChange = prevAvgWater !== 0
          ? Math.round(((avgWaterUsage - prevAvgWater) / prevAvgWater) * 100)
          : 0;
          
        metrics.push({
          category: 'Water Usage',
          value: avgWaterUsage.toFixed(1),
          unit: 'L/kg',
          trend: waterChange < 0 ? 'down' : waterChange > 0 ? 'up' : 'stable',
          change: waterChange,
          status: avgWaterUsage < benchmarks.waterUsage ? 'good' : 'warning',
          benchmark: benchmarks.waterUsage
        });
      }
      
      // 3. Energy Consumption metrics
      const energyValues = filteredReports
        .filter(r => r.formData && r.formData.energyConsumptionProcessing)
        .map(r => parseFloat(r.formData.energyConsumptionProcessing));
      
      if (energyValues.length > 0) {
        const avgEnergyConsumption = energyValues.reduce((sum, val) => sum + val, 0) / energyValues.length;
        
        const prevEnergyValues = prevReports
          .filter(r => r.formData && r.formData.energyConsumptionProcessing)
          .map(r => parseFloat(r.formData.energyConsumptionProcessing));
        
        const prevAvgEnergy = prevEnergyValues.length > 0
          ? prevEnergyValues.reduce((sum, val) => sum + val, 0) / prevEnergyValues.length
          : avgEnergyConsumption;
        
        const energyChange = prevAvgEnergy !== 0
          ? Math.round(((avgEnergyConsumption - prevAvgEnergy) / prevAvgEnergy) * 100)
          : 0;
        
        metrics.push({
          category: 'Energy Consumption',
          value: avgEnergyConsumption.toFixed(1),
          unit: 'MJ/kg',
          trend: energyChange < 0 ? 'down' : energyChange > 0 ? 'up' : 'stable',
          change: energyChange,
          status: avgEnergyConsumption < benchmarks.energyConsumption ? 'good' : 'warning',
          benchmark: benchmarks.energyConsumption
        });
      }
      
      // 4. Land Use metrics
      const landValues = filteredReports
        .filter(r => r.formData && r.formData.landUse)
        .map(r => parseFloat(r.formData.landUse));
      
      if (landValues.length > 0) {
        const avgLandUse = landValues.reduce((sum, val) => sum + val, 0) / landValues.length;
        
        const prevLandValues = prevReports
          .filter(r => r.formData && r.formData.landUse)
          .map(r => parseFloat(r.formData.landUse));
        
        const prevAvgLand = prevLandValues.length > 0
          ? prevLandValues.reduce((sum, val) => sum + val, 0) / prevLandValues.length
          : avgLandUse;
        
        const landChange = prevAvgLand !== 0
          ? Math.round(((avgLandUse - prevAvgLand) / prevAvgLand) * 100)
          : 0;
        
        metrics.push({
          category: 'Land Use',
          value: avgLandUse.toFixed(2),
          unit: 'm²/kg',
          trend: landChange < 0 ? 'down' : landChange > 0 ? 'up' : 'stable',
          change: landChange,
          status: avgLandUse <= benchmarks.landUse ? 'good' : 'warning',
          benchmark: benchmarks.landUse
        });
      }
      
      // Update impact data with calculated values
      setImpactData(metrics);
      setHasData(metrics.length > 0);

      // Calculate monthly trends if we have time-series data
      calculateMonthlyTrends(filteredReports);
      
      // Calculate process breakdown
      calculateProcessBreakdown(filteredReports);
      
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error("Error calculating insights:", err);
      setError("Failed to calculate insights from report data.");
      setHasData(false);
    }
  };
  
  // Filter reports by time range
  const filterReportsByTimeRange = (reports, range) => {
    if (range === 'all' || !range) return reports;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (range) {
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return reports;
    }
    
    return reports.filter(report => {
      if (!report.createdDate) return true;
      
      try {
        const reportDate = new Date(report.createdDate);
        return reportDate >= cutoffDate;
      } catch {
        // If date parsing fails, include the report
        return true;
      }
    });
  };
  
  // Get reports from the previous time period for trend calculation
  const getPreviousPeriodReports = (reports, range) => {
    if (range === 'all' || !range) return [];
    
    const now = new Date();
    const periodStartDate = new Date();
    const periodEndDate = new Date();
    
    switch (range) {
      case 'month':
        periodStartDate.setMonth(now.getMonth() - 2);
        periodEndDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        periodStartDate.setMonth(now.getMonth() - 6);
        periodEndDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        periodStartDate.setFullYear(now.getFullYear() - 2);
        periodEndDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return [];
    }
    
    return reports.filter(report => {
      if (!report.createdDate) return false;
      
      try {
        const reportDate = new Date(report.createdDate);
        return reportDate >= periodStartDate && reportDate < periodEndDate;
      } catch {
        return false;
      }
    });
  };
  
  // Calculate monthly trends from reports data
  const calculateMonthlyTrends = (reportsData) => {
    // Group reports by month
    const reportsByMonth = {};
    const trendData = [];
    
    // Current year reports only for monthly trends
    const currentYear = new Date().getFullYear();
    const currentYearReports = reportsData.filter(report => {
      if (!report.createdDate) return false;
      
      try {
        return new Date(report.createdDate).getFullYear() === currentYear;
      } catch {
        return false;
      }
    });
    
    // Group by month
    currentYearReports.forEach(report => {
      if (!report.createdDate || !report.formData) return;
      
      let monthKey;
      try {
        const date = new Date(report.createdDate);
        monthKey = date.toLocaleString('en-US', { month: 'short' });
      } catch (e) {
        // If parsing fails, try alternative formats
        const parts = report.createdDate.split('/');
        if (parts.length >= 2) {
          const monthNum = parseInt(parts[0]) - 1; // 0-based month
          monthKey = new Date(2000, monthNum).toLocaleString('en-US', { month: 'short' });
        } else {
          return;
        }
      }
      
      if (!reportsByMonth[monthKey]) {
        reportsByMonth[monthKey] = {
          reports: [],
          carbonFootprint: [],
          waterUsage: [],
          energyConsumption: []
        };
      }
      
      reportsByMonth[monthKey].reports.push(report);
      
      // Collect data points
      if (report.formData.globalWarmingPotential) {
        reportsByMonth[monthKey].carbonFootprint.push(
          parseFloat(report.formData.globalWarmingPotential)
        );
      }
      
      if (report.formData.waterConsumptionMining) {
        reportsByMonth[monthKey].waterUsage.push(
          parseFloat(report.formData.waterConsumptionMining)
        );
      }
      
      if (report.formData.energyConsumptionProcessing) {
        reportsByMonth[monthKey].energyConsumption.push(
          parseFloat(report.formData.energyConsumptionProcessing)
        );
      }
    });
    
    // Convert grouped data to trend format
    for (const [month, data] of Object.entries(reportsByMonth)) {
      const avgCarbonFootprint = data.carbonFootprint.length > 0 
        ? data.carbonFootprint.reduce((sum, val) => sum + val, 0) / data.carbonFootprint.length 
        : null;
      
      const avgWaterUsage = data.waterUsage.length > 0
        ? data.waterUsage.reduce((sum, val) => sum + val, 0) / data.waterUsage.length
        : null;
      
      const avgEnergyConsumption = data.energyConsumption.length > 0
        ? data.energyConsumption.reduce((sum, val) => sum + val, 0) / data.energyConsumption.length
        : null;
      
      trendData.push({
        month,
        carbonFootprint: avgCarbonFootprint !== null ? Number(avgCarbonFootprint.toFixed(2)) : 0,
        waterUsage: avgWaterUsage !== null ? Number(avgWaterUsage.toFixed(1)) : 0,
        energyConsumption: avgEnergyConsumption !== null ? Number(avgEnergyConsumption.toFixed(1)) : 0
      });
    }
    
    // Sort trend data by month
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    trendData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    
    setMonthlyTrends(trendData);
  };
  
  // Calculate process breakdown from reports data
  const calculateProcessBreakdown = (reportsData) => {
    // Count reports with different process types
    const processCounts = {
      Mining: 0,
      Processing: 0,
      Transportation: 0,
      Packaging: 0
    };
    
    // Check if reports have process information
    reportsData.forEach(report => {
      if (!report.formData) return;
      
      // Increment counters based on which processes are present in the report
      if (report.formData.miningLocation) processCounts.Mining++;
      if (report.formData.processingRoute) processCounts.Processing++;
      if (report.formData.transportDistances) processCounts.Transportation++;
      if (report.formData.packagingMaterial) processCounts.Packaging++;
    });
    
    const totalProcesses = Object.values(processCounts).reduce((sum, val) => sum + val, 0);
    
    // If we have process data, calculate percentages
    if (totalProcesses > 0) {
      const breakdown = [
        { name: 'Mining', value: (processCounts.Mining / totalProcesses) * 100, color: '#8884d8' },
        { name: 'Processing', value: (processCounts.Processing / totalProcesses) * 100, color: '#82ca9d' },
        { name: 'Transportation', value: (processCounts.Transportation / totalProcesses) * 100, color: '#ffc658' },
        { name: 'Packaging', value: (processCounts.Packaging / totalProcesses) * 100, color: '#ff7300' }
      ];
      
      // Filter out zero values
      const filteredBreakdown = breakdown.filter(item => item.value > 0);
      setProcessBreakdown(filteredBreakdown);
    } else {
      setProcessBreakdown([]);
    }
  };

  // Handle data refresh
  const refreshData = () => {
    setLoading(true);
    const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    setReports(savedReports);
    calculateInsights(savedReports);
    setLoading(false);
    setLastUpdated(new Date());
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  // Empty state component
  const EmptyState = ({ message }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <FileX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{message}</p>
      <button 
        onClick={() => refreshData()}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Data
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Environmental Impact Results</h1>
            <p className="text-gray-600 mt-1">
              {hasData 
                ? `Comprehensive analysis of environmental impacts across ${reports.length} reports` 
                : "No impact data available yet"}
              {reports.length > 0 && ` (Last updated: ${lastUpdated.toLocaleTimeString()})`}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                const exportData = {
                  impactData,
                  monthlyTrends,
                  processBreakdown,
                  exportDate: new Date().toISOString(),
                  reportCount: reports.length
                };
                
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", `impact-results-${new Date().toISOString().slice(0,10)}.json`);
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
              }}
              disabled={!hasData}
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => refreshData()}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-4 mb-6">
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Metrics</option>
            <option value="carbon">Carbon Footprint</option>
            <option value="water">Water Usage</option>
            <option value="energy">Energy Consumption</option>
          </select>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        
        {/* Error message if present */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Calculating impact insights...</p>
        </div>
      ) : !hasData ? (
        <EmptyState message="To see environmental impact results, complete at least one life cycle assessment. Results will be automatically calculated and displayed here." />
      ) : (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {impactData.length === 0 ? (
              <EmptyState message="No impact metrics available for the selected time period." />
            ) : (
              impactData.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">{metric.category}</h3>
                    {getStatusIcon(metric.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <p className="text-sm text-gray-500">{metric.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm font-medium ${
                        metric.change > 0 ? 'text-red-600' : 
                        metric.change < 0 ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {metric.change !== 0 && `${metric.change > 0 ? '+' : ''}${metric.change}%`}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Benchmark: {metric.benchmark} {metric.unit}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trends */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
              {monthlyTrends.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                  <BarChart className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">No monthly trend data available</p>
                  <p className="text-sm text-gray-400">Create reports across multiple months to see trends</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="carbonFootprint" stroke="#8884d8" name="Carbon Footprint" />
                    <Line type="monotone" dataKey="waterUsage" stroke="#82ca9d" name="Water Usage" />
                    <Line type="monotone" dataKey="energyConsumption" stroke="#ffc658" name="Energy Consumption" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Process Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact by Process</h3>
              {processBreakdown.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                  <PieChart className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">No process breakdown data available</p>
                  <p className="text-sm text-gray-400">Complete assessments with process details to see this chart</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={processBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {processBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Impact Analysis</h3>
            {impactData.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-500">No impact data to analyze</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Impact Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Current Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Industry Average</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Recommendations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {impactData.map((metric, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{metric.category}</td>
                        <td className="py-3 px-4">{metric.value} {metric.unit}</td>
                        <td className="py-3 px-4">{metric.benchmark} {metric.unit}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            metric.status === 'good' ? 'bg-green-100 text-green-800' :
                            metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {metric.status === 'good' ? 'Above Average' : 
                             metric.status === 'warning' ? 'Below Average' : 'Average'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-blue-600 hover:text-blue-800 cursor-pointer">
                          View Details →
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImpactResults;