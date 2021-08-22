import { Route, Switch } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { AvvikContextProvider } from '../../data/avvik';
import { KontrollContextProvider } from '../../data/kontroll';
import { MainLayout } from '../../layout/main';
import { MeasurementContextProvider } from '../../data/measurement';

const AvvikNewView = lazy(() => import('../../views/kontroll-avvikNew'));
const AvvikPageView = lazy(() => import('../../views/kontroll-avvikPage'));
const AvvikView = lazy(() => import('../../views/kontroll-avvik'));
const KontrollKlientView = lazy(() => import('../../views/kontroll-klient'));
const KontrollNewView = lazy(() => import('../../views/kontroll-new'));
const KontrollObjektView = lazy(() => import('../../views/kontroll-object'));
const KontrollReportView = lazy(() => import('../../views/kontroll-report'));
const KontrollerView = lazy(() => import('../../views/kontroll-dashboard'));
const MeasurementsView = lazy(() => import('../../views/kontroll-measurement'));
const SjekklisteEditView = lazy(
    () => import('../../views/kontroll-sjekkliste-edit')
);
const SjekklisterView = lazy(() => import('../../views/kontroll-sjekklister'));
const SkjemaNewView = lazy(() => import('../../views/kontroll-skjema-new'));
const SkjemaerView = lazy(() => import('../../views/kontroll-skjemaer'));

export const Kontroll = () => {
    return (
        <AvvikContextProvider>
            <MeasurementContextProvider>
                <KontrollContextProvider>
                    <MainLayout module="kontroll">
                        <Suspense fallback={<div>Loading...</div>}>
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
                                    path={`/kontroll/kl/:klientId/obj/:objectId/:kontrollId/skjema/:skjemaId/checklist/:checklistId/avvik/new`}>
                                    <AvvikNewView />
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
                        </Suspense>
                    </MainLayout>
                </KontrollContextProvider>
            </MeasurementContextProvider>
        </AvvikContextProvider>
    );
};
