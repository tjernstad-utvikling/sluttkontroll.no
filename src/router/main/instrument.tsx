import { Route, Switch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { MainLayout } from '../../layout/main';

const InstrumentsView = lazy(() => import('../../views/instrument-dashboard'));

export const Instrument = () => {
    return (
        <MainLayout module="instrument">
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path={'/'}>
                        <InstrumentsView />
                    </Route>
                </Switch>
            </Suspense>
        </MainLayout>
    );
};
