import { ChecklistRow, ChecklistSection } from '../components/skjema';
import {
    Measurement,
    MeasurementType
} from '../../../contracts/measurementApi';
import { Page, StyleSheet, View } from '@react-pdf/renderer';
import { TableCell, TableHeader, TableRow } from '../components/table';

import { Avvik } from '../../../contracts/avvikApi';
import { ExtendedSkjema } from '../../../contracts/kontrollApi';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { MeasurementModule } from '../modules/measurement.module';
import { ReportSetting } from '../../../contracts/reportApi';
import { Spacer } from '../components/spacing';
import { Text } from '../components/text';
import { sortChecklist } from '../utils/sort';

interface SkjemaPageProps {
    reportSetting: ReportSetting | undefined;
    skjema: ExtendedSkjema;
    avvik: Avvik[] | undefined;
    hasInlineMeasurements: boolean;
    measurements: Measurement[] | undefined;
    measurementTypes: MeasurementType[] | undefined;
}
export const SkjemaPage = ({
    reportSetting,
    skjema,
    avvik,
    hasInlineMeasurements,
    measurements,
    measurementTypes
}: SkjemaPageProps): JSX.Element => {
    if (reportSetting && avvik && measurements && measurementTypes) {
        return (
            <Page
                style={[
                    { position: 'relative', top: 0, left: 0 },
                    styles.container
                ]}>
                <Header
                    title={reportSetting.reportTitle}
                    location={reportSetting.reportSite}
                    date={reportSetting.reportDate}
                />
                <Text style={{ paddingVertical: 5 }}>
                    {skjema.area}, {skjema.omrade}
                </Text>
                <TableHeader title="Kontrollskjema" />
                {Object.entries(sortChecklist(skjema.checklists)).map(
                    ([key, value]) => {
                        return (
                            <View key={key}>
                                <ChecklistSection title={value.title} />
                                {value.data.map((checklist, index) => (
                                    <ChecklistRow
                                        isEvenIndex={index % 2 === 0}
                                        key={checklist.id}
                                        nr={checklist.checkpoint.prosedyreNr}
                                        prosedyre={
                                            checklist.checkpoint.prosedyre
                                        }
                                        avvik={avvik.filter(
                                            (a) =>
                                                a.checklist.id === checklist.id
                                        )}
                                        notApplicable={!checklist.aktuell}
                                    />
                                ))}
                            </View>
                        );
                    }
                )}
                {skjema.kommentar !== null && skjema.kommentar !== '' && (
                    <TableRow hasBottomBorder hasTopBorder>
                        <TableCell>{skjema.kommentar}</TableCell>
                    </TableRow>
                )}

                <Spacer />
                {hasInlineMeasurements && (
                    <>
                        <Text style={{ paddingVertical: 5 }}>
                            Måleprotokoll
                        </Text>
                        <MeasurementModule
                            measurementTypes={measurementTypes}
                            measurements={measurements}
                        />
                    </>
                )}

                <Footer />
            </Page>
        );
    }
    return (
        <Page style={{ position: 'relative', top: 0, left: 0 }}>
            <View style={styles.container}>
                <Text>Det mangler data for generering av tekst side</Text>
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        paddingBottom: 45,
        paddingHorizontal: 20
    },
    tableBorder: {
        borderTop: '1px solid #5b8bc9',
        borderBottom: '1px solid #5b8bc9',
        paddingVertical: 5
    },
    tableHeader: {
        fontSize: 14
    }
});
