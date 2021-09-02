import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { MainLayout } from '../../layout/main';

const UsersView = lazy(() => import('../../views/admin-users'));
const NewUserView = lazy(() => import('../../views/admin-newUser'));
const EditUserView = lazy(() => import('../../views/admin-editUser'));

export const Admin = () => {
    let { path } = useRouteMatch();
    return (
        <MainLayout module="instrument">
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path={`${path}/users/new`}>
                        <NewUserView />
                    </Route>
                    <Route path={`${path}/users/:userId`}>
                        <EditUserView />
                    </Route>
                    <Route path={`${path}/users`}>
                        <UsersView />
                    </Route>
                </Switch>
            </Suspense>
        </MainLayout>
    );
};
