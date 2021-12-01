import { Checklist, Skjema } from '../../contracts/kontrollApi';
import { Measurement, MeasurementType } from '../../contracts/measurementApi';
import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { TableCell, TableHeader, TableRow } from './components/table';
import { useEffect, useState } from 'react';

import { Avvik } from '../../contracts/avvikApi';
import { ChecklistRow } from './components/skjema';
import { Footer } from './components/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './components/header';
import { MeasurementModule } from './components/measurement';
import { SjekklisteValueGetter } from '../../tables/sjekkliste';
import { Spacer } from './components/spacing';

interface SkjemaPageProps {
    frontPageData: FrontPageData | undefined;
    skjema: Skjema;
    checklists: Checklist[] | undefined;
    avvik: Avvik[] | undefined;
    hasInlineMeasurements: boolean;
    measurements: Measurement[] | undefined;
    measurementTypes: MeasurementType[] | undefined;
}
export const SkjemaPage = ({
    frontPageData,
    skjema,
    checklists,
    avvik,
    hasInlineMeasurements,
    measurements,
    measurementTypes
}: SkjemaPageProps): JSX.Element => {
    const [_checklists, setChecklists] = useState<Checklist[]>([]);

    useEffect(() => {
        if (checklists) {
            setChecklists(
                checklists.sort((a, b) =>
                    String(
                        SjekklisteValueGetter(a).prosedyreNr()
                    ).localeCompare(
                        String(SjekklisteValueGetter(b).prosedyreNr()),
                        undefined,
                        { numeric: true, sensitivity: 'base' }
                    )
                )
            );
        }
    }, [checklists]);
    if (frontPageData && avvik && measurements && measurementTypes) {
        return (
            <Page
                style={[
                    { position: 'relative', top: 0, left: 0 },
                    styles.container
                ]}>
                <Header
                    title={frontPageData.title}
                    location={frontPageData.kontrollsted}
                    date={frontPageData.date}
                />
                <Text style={{ paddingVertical: 5 }}>
                    {skjema.area}, {skjema.omrade}
                </Text>
                <TableHeader title="Kontrollskjema" />
                {_checklists.map((checklist, index) => (
                    <ChecklistRow
                        isEvenIndex={index % 2 === 0}
                        key={checklist.id}
                        nr={checklist.checkpoint.prosedyreNr}
                        prosedyre={checklist.checkpoint.prosedyre}
                        avvik={avvik.filter(
                            (a) => a.checklist.id === checklist.id
                        )}
                    />
                ))}
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
