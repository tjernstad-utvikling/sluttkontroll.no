import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { InstrumentContextProvider } from '../../data/instrument';
import { MainLayout } from '../../layout/main';

const UsersView = lazy(() => import('../../views/admin-users'));

export const Admin = () => {
    let { path } = useRouteMatch();
    return (
        <InstrumentContextProvider>
            <MainLayout module="instrument">
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route path={`${path}/users`}>
                            <UsersView />
                        </Route>
                    </Switch>
                </Suspense>
            </MainLayout>
        </InstrumentContextProvider>
    );
};
