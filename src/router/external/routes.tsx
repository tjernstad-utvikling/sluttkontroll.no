import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import AvvikPageView from '../../views/external-avvikPage';
import { ExternalLayout } from '../../layout/external';

const ExternalDashboardView = lazy(
    () => import('../../views/external-dashboard')
);

export const ExternalRoutes = () => {
    let { path } = useRouteMatch();
    return (
        <ExternalLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path={`${path}avvik/:avvikId`}>
                        <AvvikPageView />
                    </Route>
                    <Route exact path={path}>
                        <ExternalDashboardView />
                    </Route>
                </Switch>
            </Suspense>
        </ExternalLayout>
    );
};
