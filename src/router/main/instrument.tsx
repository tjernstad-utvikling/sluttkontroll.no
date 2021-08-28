import { Route, Switch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { InstrumentContextProvider } from '../../data/instrument';
import { MainLayout } from '../../layout/main';

const InstrumentsView = lazy(() => import('../../views/instrument-dashboard'));
const InstrumentCalibrationView = lazy(
    () => import('../../views/instrument-calibration')
);

export const Instrument = () => {
    return (
        <InstrumentContextProvider>
            <MainLayout module="instrument">
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route path={'/calibration/:instrumentId'}>
                            <InstrumentCalibrationView />
                        </Route>
                        <Route path={'/'}>
                            <InstrumentsView />
                        </Route>
                    </Switch>
                </Suspense>
            </MainLayout>
        </InstrumentContextProvider>
    );
};
