import { Switch, useRouteMatch } from 'react-router-dom';

import { ExternalRoutes } from './external/routes';
import { PrivateRoute } from './privateRoute';
import { Roles } from '../contracts/userApi';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';

export const External = () => {
    const { loadUserFromStorage } = useAuth();
    useEffectOnce(() => {
        loadUserFromStorage();
    });
    let { path } = useRouteMatch();
    return (
        <Switch>
            <PrivateRoute
                requiredRole={[Roles.ROLE_LUKKE_AVVIK]}
                path={`${path}/`}>
                <ExternalRoutes />
            </PrivateRoute>
        </Switch>
    );
};
