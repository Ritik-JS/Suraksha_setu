import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToPDF = (data, filename = 'suraksha-report.pdf', title = 'Suraksha Setu Report') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  // Add content based on data type
  let startY = 40;
  
  if (Array.isArray(data)) {
    // If data is array, create table
    const headers = Object.keys(data[0] || {});
    const rows = data.map(item => headers.map(header => item[header]));
    
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: startY,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 139, 34] },
    });
  } else if (typeof data === 'object') {
    // If data is object, display key-value pairs
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    
    Object.entries(data).forEach(([key, value], index) => {
      const yPos = startY + (index * 10);
      doc.text(`${key}: ${JSON.stringify(value)}`, 14, yPos);
    });
  }
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} | Suraksha Setu - Disaster Management System`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(filename);
};

export const exportToCSV = (data, filename = 'suraksha-data.csv') => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Data must be a non-empty array');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportDashboardToPDF = async (elementId, filename = 'dashboard.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }
  
  try {
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
