import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { InstrumentContextProvider } from '../../data/instrument';
import { MainLayout } from '../../layout/main';

const InstrumentsView = lazy(() => import('../../views/instrument-dashboard'));
const InstrumentCalibrationView = lazy(
    () => import('../../views/instrument-calibration')
);

export const Forms = () => {
    let { path } = useRouteMatch();
    return (
        <InstrumentContextProvider>
            <MainLayout module="instrument">
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route path={`${path}/:instrumentId/calibration`}>
                            <InstrumentCalibrationView />
                        </Route>
                        <Route exact path={path}>
                            <InstrumentsView />
                        </Route>
                    </Switch>
                </Suspense>
            </MainLayout>
        </InstrumentContextProvider>
    );
};
