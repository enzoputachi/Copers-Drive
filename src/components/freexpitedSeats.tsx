// Simple Free Expired Seats Button that won't break builds
// File: components/admin/SimpleFreeExpiredButton.jsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

const SimpleFreeExpiredButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFreeExpired = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    const baseUrl = import.meta.env.VITE_APP_URL

    try {
      // Simple fetch to handle expired reserved seats
      const response = await fetch(`${baseUrl}/freeExpired`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        }
      });

      

      if (!response.ok) {
        throw new Error('Failed to free expired seats');
      }

      const result = await response.json();
      const count = result.count || 0;
      
      if (count === 0) {
        setSuccess('No expired seats found to free');
      } else {
        setSuccess(`Successfully freed ${count} expired seat${count > 1 ? 's' : ''}`);
      }

    } catch (error) {
      setError('Failed to free expired seats. Please try again.');
      console.error('Free expired seats error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Button 
        variant="outline" 
        onClick={handleFreeExpired}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Clock className="h-4 w-4 mr-2" />
            Free Expired Seats
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      
      {success && (
        <p className="text-green-500 text-sm mt-2">{success}</p>
      )}
    </div>
  );
};

export default SimpleFreeExpiredButton;