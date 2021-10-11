import { Measurement, MeasurementType } from '../../contracts/measurementApi';
import { Page, StyleSheet, Text } from '@react-pdf/renderer';

import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';
import { MeasurementModule } from './components/measurement';
import { Skjema } from '../../contracts/kontrollApi';
import { Spacer } from './components/spacing';

interface MeasurementPageProps {
    frontPageData: FrontPageData;
    skjema: Skjema;
    measurements: Measurement[];
    index: number;
    measurementTypes: MeasurementType[];
}
export const MeasurementPage = ({
    frontPageData,
    skjema,
    measurements,
    index,
    measurementTypes
}: MeasurementPageProps) => {
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
            {index === 0 && (
                <Text style={{ paddingVertical: 5 }}>Måleprotokoll</Text>
            )}
            <Text style={{ paddingVertical: 5 }}>
                {skjema.area}, {skjema.omrade}
            </Text>
            <MeasurementModule
                measurementTypes={measurementTypes}
                measurements={measurements}
            />
            <Spacer />

            <Footer />
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
