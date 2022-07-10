import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { AdminLayout } from '../../layout/admin';
import CheckpointEditView from '../../views/admin-settings-checkpointsEdit';
import CheckpointNewView from '../../views/admin-settings-checkpointsNew';
import Forms from './settings/forms';

const SettingsView = lazy(() => import('../../views/admin-settings'));
const InfoTextView = lazy(() => import('../../views/admin-settingsInfo'));
const Template = lazy(() => import('./settings/template'));
const CheckpointsView = lazy(
    () => import('../../views/admin-settings-checkpoints')
);

export const Settings = () => {
    let { path } = useRouteMatch();
    return (
        <AdminLayout module="users">
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path={`${path}/info-text`}>
                        <InfoTextView />
                    </Route>
                    <Route path={`${path}/template`}>
                        <Template />
                    </Route>
                    <Route path={`${path}/checkpoint/new`}>
                        <CheckpointNewView />
                    </Route>
                    <Route path={`${path}/checkpoint/:checkpointId`}>
                        <CheckpointEditView />
                    </Route>
                    <Route path={`${path}/checkpoint`}>
                        <CheckpointsView />
                    </Route>
                    <Route path={`${path}/forms`}>
                        <Forms />
                    </Route>
                    <Route path={`${path}`}>
                        <SettingsView />
                    </Route>
                </Switch>
            </Suspense>
        </AdminLayout>
    );
};
