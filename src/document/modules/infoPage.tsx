import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';

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
            <View style={[styles.tableBorder, { textAlign: 'center' }]}>
                <Text style={styles.tableHeader}>
                    Informasjon om inspeksjonssted
                </Text>
            </View>
            <View
                style={{
                    fontSize: 12,
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                <View
                    style={{
                        width: '5cm'
                    }}>
                    <Text>Oppdragsgiver</Text>
                </View>
                <View>
                    <Text>Test kunde</Text>
                </View>
            </View>

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
