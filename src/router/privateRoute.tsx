import { Redirect, Route } from 'react-router-dom';

import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute: React.FC<{
    path: string;
    exact?: boolean;
}> = ({ children, path, exact }) => {
    const { user, hasCheckedLocal } = useAuth();

    if (hasCheckedLocal) {
        return (
            <Route
                path={path}
                exact={exact}
                render={({ location }) =>
                    user ? (
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
