import { Switch, useRouteMatch } from 'react-router-dom';

import { PrivateRoute } from './privateRoute';
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
            <PrivateRoute path={`${path}/users`}>
                <Users />
            </PrivateRoute>
        </Switch>
    );
};
