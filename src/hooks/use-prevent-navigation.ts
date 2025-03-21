
import { useEffect } from 'react';

interface UsePreventNavigationOptions {
  enabled: boolean;
  message?: string;
}

export function usePreventNavigation({ 
  enabled = true, 
  message = "Changes you made may not be saved. Are you sure you want to leave this page?" 
}: UsePreventNavigationOptions) {
  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!enabled) return;
      
      // Standard way to show a confirmation dialog
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, message]);
}
