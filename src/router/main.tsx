import { Route, Switch } from 'react-router-dom';

import { KontrollContextProvider } from '../data/kontroll';
import KontrollNewView from '../views/kontroll-new';
import KontrollerView from '../views/kontroll-dashboard';
import { MainLayout } from '../layout/main';
import SjekklisterView from '../views/kontroll-sjekklister';
import SkjemaerView from '../views/kontroll-skjemaer';

export const Main = () => {
    return (
        <KontrollContextProvider>
            <MainLayout>
                <Switch>
                    <Route exact path={`/kontroll`}>
                        <KontrollerView />
                    </Route>
                    <Route exact path={`/kontroll/new`}>
                        <KontrollNewView />
                    </Route>
                    <Route path={`/kontroll/:kontrollId/skjema/:skjemaId`}>
                        <SjekklisterView />
                    </Route>
                    <Route path={`/kontroll/:kontrollId`}>
                        <SkjemaerView />
                    </Route>
                </Switch>
            </MainLayout>
        </KontrollContextProvider>
    );
};
