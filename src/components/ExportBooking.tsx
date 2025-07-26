// Simple Export Button that won't break builds
// File: components/admin/SimpleExportButton.jsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const SimpleExportButton = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    const baseUrl = import.meta.env.VITE_APP_URL

    try {
      // Simple fetch without complex date logic
      const response = await fetch(`${baseUrl}/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `booking-export-${Date.now()}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      setError('Export failed. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <Button 
        variant="outline" 
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default SimpleExportButton;