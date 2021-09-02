import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { AdminLayout } from '../../layout/admin';

const SettingsView = lazy(() => import('../../views/admin-settings'));
const InfoTextView = lazy(() => import('../../views/admin-settingsInfo'));

export const Settings = () => {
    let { path } = useRouteMatch();
    return (
        <AdminLayout module="users">
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path={`${path}/info-text`}>
                        <InfoTextView />
                    </Route>

                    <Route path={`${path}`}>
                        <SettingsView />
                    </Route>
                </Switch>
            </Suspense>
        </AdminLayout>
    );
};
