import { Page, StyleSheet } from '@react-pdf/renderer';
import { TableCell, TableHeader, TableRow } from './components/table';

import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';
import { Spacer } from './components/spacing';

interface SkjemaPageProps {
    frontPageData: FrontPageData;
}
export const SkjemaPage = ({ frontPageData }: SkjemaPageProps) => {
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

            <TableHeader title="Kontrollskjema" />
            <TableRow>
                <TableCell width={50}>T1</TableCell>
                <TableCell width={500}>
                    Er fordelinger/sikringsskap ok?
                </TableCell>
                <TableCell width={80}>Avvik (99)</TableCell>
            </TableRow>

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
