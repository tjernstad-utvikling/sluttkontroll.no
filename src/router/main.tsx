import { Route, Switch } from 'react-router-dom';

import { AvvikContextProvider } from '../data/avvik';
import AvvikPageView from '../views/kontroll-avvikPage';
import AvvikView from '../views/kontroll-avvik';
import { KontrollContextProvider } from '../data/kontroll';
import KontrollKlientView from '../views/kontroll-klient';
import KontrollNewView from '../views/kontroll-new';
import KontrollObjektView from '../views/kontroll-object';
import KontrollReportView from '../views/kontroll-report';
import KontrollerView from '../views/kontroll-dashboard';
import { MainLayout } from '../layout/main';
import { MeasurementContextProvider } from '../data/measurement';
import MeasurementsView from '../views/kontroll-measurement';
import SjekklisteEditView from '../views/kontroll-sjekkliste-edit';
import SjekklisterView from '../views/kontroll-sjekklister';
import SkjemaNewView from '../views/kontroll-skjema-new';
import SkjemaerView from '../views/kontroll-skjemaer';

export const Main = () => {
    return (
        <AvvikContextProvider>
            <MeasurementContextProvider>
                <KontrollContextProvider>
                    <MainLayout>
                        <Switch>
                            <Route exact path={`/kontroll`}>
                                <KontrollerView />
                            </Route>
                            <Route exact path={`/kontroll/new`}>
                                <KontrollNewView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/skjema/:skjemaId/edit-checklist`}>
                                <SjekklisteEditView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/skjema/:skjemaId/checklist/:checklistId/avvik/:avvikId`}>
                                <AvvikPageView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/skjema/:skjemaId/checklist/:checklistId/avvik`}>
                                <AvvikView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/skjema/new`}>
                                <SkjemaNewView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/skjema/:skjemaId/measurement`}>
                                <MeasurementsView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/skjema/:skjemaId/avvik/:avvikId`}>
                                <AvvikPageView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/skjema/:skjemaId/avvik`}>
                                <AvvikView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/skjema/:skjemaId`}>
                                <SjekklisterView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/measurement`}>
                                <MeasurementsView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/avvik/:avvikId`}>
                                <AvvikPageView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/avvik`}>
                                <AvvikView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/report`}>
                                <KontrollReportView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId`}>
                                <SkjemaerView />
                            </Route>
                            <Route
                                path={`/kontroll/kl/:klientId/obj/:objectId`}>
                                <KontrollObjektView />
                            </Route>
                            <Route path={`/kontroll/kl/:klientId`}>
                                <KontrollKlientView />
                            </Route>
                        </Switch>
                    </MainLayout>
                </KontrollContextProvider>
            </MeasurementContextProvider>
        </AvvikContextProvider>
    );
};
