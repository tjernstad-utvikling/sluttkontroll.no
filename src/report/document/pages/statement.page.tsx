import {
    LocalImage,
    ReportKontroll,
    ReportSetting
} from '../../../contracts/reportApi';
import { Page, StyleSheet, View } from '@react-pdf/renderer';

import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { InstrumentModule } from '../modules/instrument.module';
import { OutputData } from '@editorjs/editorjs';
import { StatementModule } from '../modules/statement.module';
import { Text } from '../components/text';

interface StatementPageProps {
    statement: OutputData | undefined;
    reportSetting: ReportSetting | undefined;
    statementImages: LocalImage[];
    kontroll: ReportKontroll | undefined;
    hasStatement: boolean;
    hasInstrument: boolean;
}
export const StatementPage = ({
    statement,
    reportSetting,
    statementImages,
    kontroll,
    hasInstrument,
    hasStatement
}: StatementPageProps): JSX.Element => {
    if (statement && reportSetting) {
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
                {hasStatement && (
                    <StatementModule
                        statement={statement}
                        statementImages={statementImages}
                    />
                )}
                {hasInstrument && (
                    <InstrumentModule instruments={kontroll?.instrumenter} />
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
