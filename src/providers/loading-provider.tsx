import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type LoadingContextValue = {
  isLoading: boolean;
  message?: string;
  show: (message?: string) => void;
  hide: () => void;
  setLoading: (value: boolean, message?: string) => void;
};

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const show = useCallback((msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hide = useCallback(() => {
    setIsLoading(false);
    setMessage(undefined);
  }, []);

  const setLoading = useCallback((value: boolean, msg?: string) => {
    if (value) {
      show(msg);
    } else {
      hide();
    }
  }, [show, hide]);

  const value = useMemo(
    () => ({ isLoading, message, show, hide, setLoading }),
    [isLoading, message, show, hide, setLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-white shadow-lg border border-border">
            <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <div className="text-sm font-medium text-foreground">
              {message ?? 'Cargando...'}
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
}

