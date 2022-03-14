import { QueryClient, QueryClientProvider } from 'react-query';
import { Switch, useRouteMatch } from 'react-router-dom';

import { ExternalRoutes } from './external/routes';
import { PrivateRoute } from './privateRoute';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Roles } from '../contracts/userApi';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';

// Create a client
const queryClient = new QueryClient();

export const External = () => {
    const { loadUserFromStorage } = useAuth();
    useEffectOnce(() => {
        loadUserFromStorage();
    });
    let { path } = useRouteMatch();
    return (
        <QueryClientProvider client={queryClient}>
            <Switch>
                <PrivateRoute
                    requiredRole={[Roles.ROLE_LUKKE_AVVIK]}
                    path={`${path}/`}>
                    <ExternalRoutes />
                </PrivateRoute>
            </Switch>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
