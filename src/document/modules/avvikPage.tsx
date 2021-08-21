import { Page, StyleSheet, Text } from '@react-pdf/renderer';

import { Avvik } from '../../contracts/avvikApi';
import { AvvikModule } from './components/avvik';
import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';
import { Skjema } from '../../contracts/kontrollApi';
import { Spacer } from './components/spacing';

interface AvvikPageProps {
    frontPageData: FrontPageData;
    skjema: Skjema;
    avvik: Avvik[];
}
export const AvvikPage = ({ frontPageData, skjema, avvik }: AvvikPageProps) => {
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
            {avvik.map((a) => (
                <AvvikModule key={a.id} avvik={a} />
            ))}

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
