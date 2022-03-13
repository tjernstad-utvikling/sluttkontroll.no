import { QueryClient, QueryClientProvider } from 'react-query';

import ExternalDashboardView from '../views/external-dashboard';
import { ExternalLayout } from '../layout/external';
import { PrivateRoute } from './privateRoute';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Roles } from '../contracts/userApi';
import { Switch } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';

// Create a client
const queryClient = new QueryClient();

export const External = () => {
    const { loadUserFromStorage } = useAuth();
    useEffectOnce(() => {
        loadUserFromStorage();
    });

    return (
        <QueryClientProvider client={queryClient}>
            <Switch>
                <PrivateRoute
                    requiredRole={[Roles.ROLE_LUKKE_AVVIK]}
                    path={`/`}>
                    <ExternalLayout>
                        <ExternalDashboardView />
                    </ExternalLayout>
                </PrivateRoute>
            </Switch>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
