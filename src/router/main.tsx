import { Route, Switch } from 'react-router-dom';

import { KontrollContextProvider } from '../data/kontroll';
import KontrollerView from '../views/kontroll-dashboard';
import { MainLayout } from '../layout/main';
import SkjemaerView from '../views/kontroll-skjemaer';

export const Main = () => {
    return (
        <KontrollContextProvider>
            <MainLayout>
                <Switch>
                    <Route exact path={`/kontroll`}>
                        <KontrollerView />
                    </Route>
                    <Route path={`/kontroll/:kontrollId`}>
                        <SkjemaerView />
                    </Route>
                </Switch>
            </MainLayout>
        </KontrollContextProvider>
    );
};
