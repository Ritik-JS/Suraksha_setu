import React, { useState } from 'react';
import { Download, FileText, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToPDF, exportToCSV } from '@/utils/exportUtils';
import { toast } from 'sonner';

const DownloadButton = ({ data, filename = 'suraksha-data', title = 'Suraksha Setu Report' }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(data, `${filename}.pdf`, title);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      exportToCSV(data, `${filename}.csv`);
      toast.success('CSV downloaded successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting}
          data-testid="download-button"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportPDF} data-testid="export-pdf-button">
          <FileText className="w-4 h-4 mr-2" />
          Download as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV} data-testid="export-csv-button">
          <File className="w-4 h-4 mr-2" />
          Download as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadButton;
