import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { MainLayout } from '../../layout/main';

const ProfileView = lazy(() => import('../../views/user-profile'));

export const User = () => {
    let { path } = useRouteMatch();
    return (
        <MainLayout module="instrument">
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route exact path={path}>
                        <ProfileView />
                    </Route>
                </Switch>
            </Suspense>
        </MainLayout>
    );
};
