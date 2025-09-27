import React, { useState } from 'react';
import { FileText, Loader } from 'lucide-react';
import { reportUtils } from '../utils/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PDFReportButton = ({ formData = {}, buttonText = 'Download PDF Report' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(22);
      doc.setTextColor(0, 51, 102); // Navy blue color for the title
      doc.text('Life Cycle Assessment Report', 105, 20, { align: 'center' });
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100); // Gray color for the date
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
      
      // Add horizontal line
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 35, 190, 35);
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Start position for content
      let yPosition = 45;
      
      // Add metal type if available
      const metalType = formData.metalType || 'Unknown Metal';
      doc.setFontSize(16);
      doc.text(`Life Cycle Assessment for: ${metalType}`, 20, yPosition);
      yPosition += 10;
      
      // Generate AI insights
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204); // Blue for section headers
      doc.text('AI-Generated LCA Insights', 20, yPosition);
      yPosition += 10;
      
      // Add insights content
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      // Generate insights based on form data
      let insights = '';
      const requiredFields = [
        'metalType', 'miningLocation', 'oreGrade', 'productionVolume', 
        'energyConsumptionMining', 'waterConsumptionMining', 'emissionsMining',
        'energyConsumptionProcessing', 'recyclingRate'
      ];
      
      const filledFields = requiredFields.filter(field => formData && formData[field]);
      const completeness = filledFields.length / requiredFields.length;
      
      if (completeness < 0.5) {
        insights = `Based on the provided incomplete dataset, a comprehensive environmental impact assessment is impossible. However, assuming typical ${metalType} mining and processing practices, the process likely has significant environmental impacts due to energy-intensive mining and processing, potential water consumption issues, and emissions related to both. The lack of data on ore grade, production volume, energy sources, chemical inputs, and waste management prevents a detailed quantification of these impacts.`;
      } else {
        insights = `The life cycle assessment for ${metalType} indicates significant environmental impacts across multiple categories. Based on the provided data, the most substantial impacts are in ${formData.energyConsumptionMining ? 'energy consumption during mining operations' : 'resource extraction and processing'}, with approximately ${formData.emissionsMining || 'unknown'} kg CO₂-eq emissions and ${formData.waterConsumptionMining || 'significant'} water usage. The recovery rate of ${formData.recoveryRate || 'typical industry rates'} suggests opportunities for optimization in the production process.`;
      }
      
      // Handle text wrapping for insights
      const splitInsights = doc.splitTextToSize(insights, 170);
      doc.text(splitInsights, 20, yPosition);
      yPosition += splitInsights.length * 7 + 10;
      
      // Add recommendations section
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('Recommendations', 20, yPosition);
      yPosition += 10;
      
      // Generate recommendations based on form data
      const recommendations = [
        "Conduct a comprehensive data collection effort to fill in the missing data points, including ore grade, production volume, energy consumption (mining and processing), water consumption, emissions, chemical inputs, recovery rate, transport distances, and waste disposal methods.",
        "Implement energy-efficient technologies in both mining and processing operations, such as high-efficiency grinding mills, optimized ventilation systems, and waste heat recovery systems.",
        "Consider renewable energy sources for processing facilities to reduce the carbon footprint of operations.",
        "Develop a water management plan that includes recycling and reuse strategies to minimize freshwater consumption.",
        "Improve material efficiency through better ore sorting technologies and process optimization to reduce waste generation."
      ];
      
      // Add custom recommendations based on form data
      if (formData.recyclingRate && parseFloat(formData.recyclingRate) < 50) {
        recommendations.push("Increase the recycling rate by implementing better collection systems and technologies for metal recovery from waste streams.");
      }
      
      if (formData.energyConsumptionProcessing && formData.energyConsumptionMining) {
        recommendations.push("Focus on reducing energy consumption in the most energy-intensive process steps identified in the assessment.");
      }
      
      // Add recommendations with bullet points
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      const selectedRecommendations = recommendations.slice(0, 5); // Limit to 5 recommendations
      
      selectedRecommendations.forEach((recommendation, index) => {
        // Add bullet point
        doc.text('•', 20, yPosition);
        
        // Add wrapped recommendation text
        const splitRecommendation = doc.splitTextToSize(recommendation, 160);
        doc.text(splitRecommendation, 25, yPosition);
        yPosition += splitRecommendation.length * 7 + 5;
        
        // Add page if needed
        if (yPosition > 270 && index < selectedRecommendations.length - 1) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      yPosition += 10;
      
      // Add form data section if there's room, otherwise add a new page
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Add assessment data
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('Assessment Data Summary', 20, yPosition);
      yPosition += 10;
      
      // Group form data by categories
      const categories = {
        'General Information': ['metalType', 'miningLocation', 'oreGrade', 'productionVolume', 'functionalUnit'],
        'Mining & Production': ['energyConsumptionMining', 'waterConsumptionMining', 'emissionsMining', 'landUse'],
        'Processing & Energy': ['processingRoute', 'energySource', 'energyConsumptionProcessing', 'recoveryRate'],
        'Environmental Impact': ['globalWarmingPotential', 'acidificationPotential', 'waterScarcityFootprint']
      };
      
      // Create table data
      const tableData = [];
      for (const [category, fields] of Object.entries(categories)) {
        tableData.push([{content: category, colSpan: 2, styles: {fillColor: [240, 240, 240], fontStyle: 'bold'}}]);
        
        fields.forEach(field => {
          if (formData[field]) {
            const label = field
              .replace(/([A-Z])/g, ' $1') // Add space before capital letters
              .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
            tableData.push([label, formData[field].toString()]);
          }
        });
        
        // Add empty row between categories
        tableData.push([{content: '', colSpan: 2, styles: {cellPadding: 1}}]);
      }
      
      // Add table
      doc.autoTable({
        startY: yPosition,
        head: [['Field', 'Value']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 250, 255] },
        margin: { left: 20, right: 20 }
      });
      
      // Add footer to all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text('Generated by OreSense AI', 105, doc.internal.pageSize.height - 10, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
      }
      
      // Save the PDF file with a descriptive name
      const filename = `OreSense_LCA_Report_${metalType.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
      doc.save(filename);
      
      // Save report to localStorage
      const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
      const newReport = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        title: `${metalType} Life Cycle Assessment`,
        filename: filename,
        metalType: metalType,
        insights: insightsText,
        recommendations: selectedRecommendations.slice(0, 3),
        formData: formData // Save the complete form data
      };
      
      savedReports.push(newReport);
      localStorage.setItem('savedReports', JSON.stringify(savedReports));
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        setIsGenerating(false);
        window.location.href = '/dashboard';
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to generate PDF report');
      console.error('PDF generation error:', err);
      setIsGenerating(false);
    }
  }

  return (
    <button
      onClick={handleGenerateReport}
      disabled={isGenerating}
      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      )}
    </button>
  );
};



export default PDFReportButton;
