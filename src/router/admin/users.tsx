import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { AdminLayout } from '../../layout/admin';

const UsersView = lazy(() => import('../../views/admin-users'));
const NewUserView = lazy(() => import('../../views/admin-newUser'));
const EditUserView = lazy(() => import('../../views/admin-editUser'));

export const Users = () => {
    let { path } = useRouteMatch();
    return (
        <AdminLayout module="users">
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path={`${path}/new`}>
                        <NewUserView />
                    </Route>
                    <Route path={`${path}/:userId`}>
                        <EditUserView />
                    </Route>
                    <Route path={`${path}`}>
                        <UsersView />
                    </Route>
                </Switch>
            </Suspense>
        </AdminLayout>
    );
};
