import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Filter, X } from 'lucide-react';

const SimpleExportButton = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [showFiltersPopup, setShowFiltersPopup] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    tripId: '',
    busPlateNo: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
      tripId: '',
      busPlateNo: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    const baseUrl = import.meta.env.VITE_APP_URL;
    const queryString = buildQueryString();
    const url = queryString ? `${baseUrl}/export?${queryString}` : `${baseUrl}/export`;

    try {
      const response = await fetch(url, {
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
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Create filename with filter info
      const timestamp = new Date().toISOString().split('T')[0];
      let filename = `booking-export-${timestamp}`;
      if (filters.busPlateNo) filename += `-bus-${filters.busPlateNo}`;
      if (filters.status) filename += `-${filters.status}`;
      link.download = `${filename}.csv`;
      
      link.click();
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      setError('Export failed. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const closePopup = () => {
    setShowFiltersPopup(false);
  };

  const applyFiltersAndExport = () => {
    setShowFiltersPopup(false);
    handleExport();
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
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
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFiltersPopup(true)}
          className={hasActiveFilters ? "text-green-600 p-4" : "p-4 border bg-white"}
        >
          <Filter className="h-4 w-4" />
          {hasActiveFilters && (
            <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded-full">
              {Object.values(filters).filter(v => v).length}
            </span>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Filter Popup Modal */}
      {showFiltersPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closePopup}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Filter Export Data</h3>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Primary Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="busPlateNo" className="text-sm font-medium text-gray-700">Bus Plate Number</Label>
                  <Input
                    id="busPlateNo"
                    placeholder="e.g., ABC-123"
                    value={filters.busPlateNo}
                    onChange={(e) => handleFilterChange('busPlateNo', e.target.value)}
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">Booking Status</Label>
                  <select
                    id="status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Secondary Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tripId" className="text-sm font-medium text-gray-700">Trip ID</Label>
                  <Input
                    id="tripId"
                    type="number"
                    placeholder="Enter Trip ID"
                    value={filters.tripId}
                    onChange={(e) => handleFilterChange('tripId', e.target.value)}
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">From Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">To Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
              
              {hasActiveFilters && (
                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-md">
                  <strong>Active filters:</strong> {
                    Object.entries(filters)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')
                  }
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <Button
                variant="ghost"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={closePopup}
                >
                  Cancel
                </Button>
                <Button
                  onClick={applyFiltersAndExport}
                  disabled={isExporting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Apply & Export
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleExportButton;