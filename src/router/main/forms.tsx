import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { MainLayout } from '../../layout/main';

const FormsView = lazy(() => import('../../views/forms-dashboard'));

export const Forms = () => {
    let { path } = useRouteMatch();
    return (
        <MainLayout module="instrument">
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route exact path={path}>
                        <FormsView />
                    </Route>
                </Switch>
            </Suspense>
        </MainLayout>
    );
};
