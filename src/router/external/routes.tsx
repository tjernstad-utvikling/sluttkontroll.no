import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { ExternalLayout } from '../../layout/external';

const ExternalDashboardView = lazy(
    () => import('../../views/external-dashboard')
);
const AvvikPageView = lazy(() => import('../../views/external-avvikPage'));
const ProfileView = lazy(() => import('../../views/user-profile'));

export const ExternalRoutes = () => {
    let { path } = useRouteMatch();
    return (
        <ExternalLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route
                        path={`${path}client/:clientId/location/:locationId`}>
                        <ExternalDashboardView />
                    </Route>
                    <Route path={`${path}client/:clientId`}>
                        <ExternalDashboardView />
                    </Route>
                    <Route path={`${path}avvik/:avvikId`}>
                        <AvvikPageView />
                    </Route>
                    <Route path={`${path}profile`}>
                        <ProfileView />
                    </Route>
                    <Route path={`${path}avvik`}>
                        <ExternalDashboardView />
                    </Route>
                    <Route exact path={path}>
                        <ExternalDashboardView />
                    </Route>
                </Switch>
            </Suspense>
        </ExternalLayout>
    );
};
