import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from './auth/AuthContext';
import { FlashMessageContext } from './lib/alerts';
import { LoadingProvider } from './providers/loading-provider';
import { SettingsProvider } from './providers/settings-provider';
import { ThemeProvider } from './providers/theme-provider';
import { AppRouting } from './routing/AppRouting';

const { BASE_URL } = import.meta.env;
export function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <LoadingBarContainer>
          <AuthProvider>
            <SettingsProvider>
              <ThemeProvider>
                <BrowserRouter basename={BASE_URL}>
                  <FlashMessageContext>
                    <LoadingProvider>
                      <Toaster />
                      <AppRouting />
                    </LoadingProvider>
                  </FlashMessageContext>
                </BrowserRouter>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </LoadingBarContainer>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
