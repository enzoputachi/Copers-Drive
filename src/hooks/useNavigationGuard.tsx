import { useEffect } from 'react';

export interface UseNavigationGuardProps {
  shouldPrevent: boolean;
  message?: string;
  onNavigationAttempt?: () => void;
}

export function useNavigationGuard({
  shouldPrevent,
  message = 'You have unsaved changes. Are you sure you want to leave?',
  onNavigationAttempt,
}: UseNavigationGuardProps) {
  useEffect(() => {
    if (!shouldPrevent) return;

    // catch refresh/close
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    // catch back/forward
    const onPopState = () => {
      onNavigationAttempt?.();
      // push state back so URL doesn’t change
      window.history.pushState(null, '', window.location.pathname);
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('popstate', onPopState);
    // prime the history stack
    window.history.pushState(null, '', window.location.pathname);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('popstate', onPopState);
    };
  }, [shouldPrevent, message, onNavigationAttempt]);
}
