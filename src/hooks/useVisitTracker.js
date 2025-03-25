import { useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const useVisitTracker = () => {
  useEffect(() => {
    const recordVisit = async () => {
      try {
        await fetch(`${API_URL}/api/record-visit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Failed to record visit:', error);
      }
    };

    recordVisit();
  }, []); // Only run once when component mounts
}; 