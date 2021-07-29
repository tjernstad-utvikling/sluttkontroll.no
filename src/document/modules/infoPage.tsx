import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { TableCell, TableHeader, TableRow } from './components/table';

import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';
import { Spacer } from './components/spacing';

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
            <TableRow tint>
                <TableCell isTitle width={180}>
                    Oppdragsgiver
                </TableCell>
                <TableCell>Test client AS</TableCell>
            </TableRow>
            <TableRow>
                <TableCell isTitle width={180}>
                    Kontrollsted
                </TableCell>
                <TableCell>Test sted</TableCell>
            </TableRow>
            <TableRow hasBottomBorder tint>
                <TableCell isTitle width={180}>
                    Adresse
                </TableCell>
                <TableCell>Test sted</TableCell>
            </TableRow>
            {/* Kontaktperson under */}
            <TableRow>
                <TableCell isTitle width={180}>
                    Kontaktperson
                </TableCell>
                <TableCell>Test sted</TableCell>
            </TableRow>
            <TableRow tint>
                <TableCell isTitle width={180}>
                    Telefonnummer
                </TableCell>
                <TableCell>Test sted</TableCell>
            </TableRow>
            <TableRow hasBottomBorder>
                <TableCell isTitle width={180}>
                    E-postadresse
                </TableCell>
                <TableCell>Test sted</TableCell>
            </TableRow>
            <Spacer />

            <TableHeader title="Kontrollert av" />
            <TableRow tint>
                <TableCell isTitle width={180}>
                    Kontrollør
                </TableCell>
                <TableCell>Test client AS</TableCell>
            </TableRow>
            <TableRow>
                <TableCell isTitle width={180}>
                    Telefonnummer
                </TableCell>
                <TableCell>Test client AS</TableCell>
            </TableRow>
            <TableRow hasBottomBorder tint>
                <TableCell isTitle width={180}>
                    E-postadresse
                </TableCell>
                <TableCell>Test client AS</TableCell>
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
