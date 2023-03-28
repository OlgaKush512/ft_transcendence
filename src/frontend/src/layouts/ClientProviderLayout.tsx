import { useState } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { useAuth } from '../tools/auth';
import { Outlet } from 'react-router-dom';
import { isAxiosError } from '../tools/apiHandler';

const ClientProviderLayout = () => {
  const { triggerLogin } = useAuth();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false } },
        queryCache: new QueryCache({
          onError: async (error, query) => {
            if (isAxiosError(error)) {
              if (
                (error.response?.data as any).message ===
                'Missing or Invalid Token'
              ) {
                triggerLogin();
              }
            }
          },
        }),
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
};

export default ClientProviderLayout;
