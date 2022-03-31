import { Switch, useRouteMatch } from 'react-router-dom';

import { PrivateRoute } from './privateRoute';
import { Roles } from '../contracts/userApi';
import { Settings } from './admin/settings';
import { Users } from './admin/users';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';

export const Admin = () => {
    const { loadUserFromStorage } = useAuth();
    useEffectOnce(() => {
        loadUserFromStorage();
    });
    let { path } = useRouteMatch();
    return (
        <Switch>
            <PrivateRoute
                requiredRole={[Roles.ROLE_ADMIN, Roles.ROLE_KONTROLL]}
                path={`${path}/users`}>
                <Users />
            </PrivateRoute>
            <PrivateRoute
                requiredRole={[Roles.ROLE_ADMIN, Roles.ROLE_KONTROLL]}
                path={`${path}/settings`}>
                <Settings />
            </PrivateRoute>
        </Switch>
    );
};
