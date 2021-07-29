import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { TableHeader, TableRow } from './components/table';

import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';

interface InfoPageProps {
    frontPageData: FrontPageData;
}
export const InfoPage = ({ frontPageData }: InfoPageProps) => {
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
            <TableHeader title="Informasjon om inspeksjonssted" />
            <TableRow>
                <View
                    style={{
                        width: '5cm'
                    }}>
                    <Text>Oppdragsgiver</Text>
                </View>
                <View>
                    <Text>Test kunde</Text>
                </View>
            </TableRow>

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
