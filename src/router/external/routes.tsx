import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { Avvik } from './avvik';
import { ExternalLayout } from '../../layout/external';

const ExternalDashboardView = lazy(
    () => import('../../views/external-dashboard')
);

export const ExternalRoutes = () => {
    let { path } = useRouteMatch();
    console.log({ path });
    return (
        <ExternalLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path={`${path}/avvik`}>
                        <Avvik />
                    </Route>
                    <Route path={`${path}`}>
                        <ExternalDashboardView />
                    </Route>
                </Switch>
            </Suspense>
        </ExternalLayout>
    );
};
