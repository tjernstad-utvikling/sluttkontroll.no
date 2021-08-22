import { Route, Switch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { MainLayout } from '../../layout/main';

const KontrollerView = lazy(() => import('../../views/kontroll-dashboard'));

export const Instrument = () => {
    return (
        <MainLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path={'/'}>
                        <KontrollerView />
                    </Route>
                </Switch>
            </Suspense>
        </MainLayout>
    );
};
