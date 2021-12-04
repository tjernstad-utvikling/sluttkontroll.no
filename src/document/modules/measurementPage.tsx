import { Measurement, MeasurementType } from '../../contracts/measurementApi';
import { Page, StyleSheet, View } from '@react-pdf/renderer';

import { Footer } from './components/footer';
import { Header } from './components/header';
import { MeasurementModule } from './components/measurement';
import { ReportSetting } from '../../contracts/reportApi';
import { Skjema } from '../../contracts/kontrollApi';
import { Spacer } from './components/spacing';
import { Text } from './components/text';

interface MeasurementPageProps {
    reportSetting: ReportSetting | undefined;
    skjema: Skjema;
    measurements: Measurement[] | undefined;
    index: number;
    measurementTypes: MeasurementType[] | undefined;
}
export const MeasurementPage = ({
    reportSetting,
    skjema,
    measurements,
    index,
    measurementTypes
}: MeasurementPageProps): JSX.Element => {
    if (reportSetting && measurements && measurementTypes) {
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
