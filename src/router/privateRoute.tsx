import { Redirect, Route } from 'react-router-dom';

import React from 'react';
import { Roles } from '../contracts/userApi';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute: React.FC<{
    path: string;
    exact?: boolean;
    requiredRole: Roles;
}> = ({ children, path, exact, requiredRole }) => {
    const { user, hasCheckedLocal, userHasRole } = useAuth();

    if (hasCheckedLocal) {
        return (
            <Route
                path={path}
                exact={exact}
                render={({ location }) =>
                    user && userHasRole(requiredRole) ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/',
                                state: { from: location }
                            }}
                        />
                    )
                }
            />
        );
    } else {
        return <div></div>;
    }
};
