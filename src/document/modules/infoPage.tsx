import { Page, StyleSheet } from '@react-pdf/renderer';
import { TableCell, TableHeader, TableRow } from './components/table';

import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';
import { InfoBox } from './components/box';
import { ReportKontroll } from '../../contracts/kontrollApi';
import { Spacer } from './components/spacing';

interface InfoPageProps {
    frontPageData: FrontPageData;
    infoText: string;
    kontroll: ReportKontroll;
}
export const InfoPage = ({
    frontPageData,
    infoText,
    kontroll
}: InfoPageProps) => {
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
                <TableCell>
                    {kontroll.rapportEgenskaper.oppdragsgiver}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell isTitle width={180}>
                    Kontrollsted
                </TableCell>
                <TableCell>{kontroll.rapportEgenskaper.kontrollsted}</TableCell>
            </TableRow>
            <TableRow hasBottomBorder tint>
                <TableCell isTitle width={180}>
                    Adresse
                </TableCell>
                <TableCell>{kontroll.rapportEgenskaper.adresse}</TableCell>
            </TableRow>
            {/* Kontaktperson under */}
            <TableRow>
                <TableCell isTitle width={180}>
                    Kontaktperson
                </TableCell>
                <TableCell>
                    {kontroll.rapportEgenskaper.kontaktperson}
                </TableCell>
            </TableRow>
            <TableRow tint>
                <TableCell isTitle width={180}>
                    Telefonnummer
                </TableCell>
                <TableCell>
                    {kontroll.rapportEgenskaper.kontaktTelefon}
                </TableCell>
            </TableRow>
            <TableRow hasBottomBorder>
                <TableCell isTitle width={180}>
                    E-postadresse
                </TableCell>
                <TableCell>{kontroll.rapportEgenskaper.kontaktEpost}</TableCell>
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

            <Spacer />

            <InfoBox text={infoText} />

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
