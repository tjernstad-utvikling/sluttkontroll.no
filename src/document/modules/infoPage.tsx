import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { RapportEgenskaper, RapportUser } from '../../contracts/kontrollApi';
import { TableCell, TableHeader, TableRow } from './components/table';

import { Footer } from './components/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './components/header';
import { OutputData } from '@editorjs/editorjs';
import { SertifikatBlock } from './components/sertifikat';
import { Spacer } from './components/spacing';
import { TextBox } from './components/box';

interface InfoPageProps {
    frontPageData: FrontPageData | undefined;
    infoText: OutputData | undefined;
    rapportEgenskaper: RapportEgenskaper | undefined | null;
    rapportUser: RapportUser | undefined | null;
}
export const InfoPage = ({
    frontPageData,
    infoText,
    rapportEgenskaper,
    rapportUser
}: InfoPageProps): JSX.Element => {
    if (frontPageData && infoText && rapportEgenskaper && rapportUser) {
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
                    <TableCell>{rapportEgenskaper.oppdragsgiver}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell isTitle width={180}>
                        Kontrollsted
                    </TableCell>
                    <TableCell>{rapportEgenskaper.kontrollsted}</TableCell>
                </TableRow>
                <TableRow hasBottomBorder tint>
                    <TableCell isTitle width={180}>
                        Adresse
                    </TableCell>
                    <TableCell>{rapportEgenskaper.adresse}</TableCell>
                </TableRow>
                {/* Kontaktperson under */}
                <TableRow>
                    <TableCell isTitle width={180}>
                        Kontaktperson
                    </TableCell>
                    <TableCell>{rapportEgenskaper.kontaktperson}</TableCell>
                </TableRow>
                <TableRow tint>
                    <TableCell isTitle width={180}>
                        Telefonnummer
                    </TableCell>
                    <TableCell>{rapportEgenskaper.kontaktTelefon}</TableCell>
                </TableRow>
                <TableRow hasBottomBorder>
                    <TableCell isTitle width={180}>
                        E-postadresse
                    </TableCell>
                    <TableCell>{rapportEgenskaper.kontaktEpost}</TableCell>
                </TableRow>
                <Spacer />
                <TableHeader title="Kontrollert av" />
                <TableRow tint>
                    <TableCell isTitle width={180}>
                        Kontrollør
                    </TableCell>
                    <TableCell>{rapportUser.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell isTitle width={180}>
                        Telefonnummer
                    </TableCell>
                    <TableCell>{rapportUser.phone}</TableCell>
                </TableRow>
                <TableRow hasBottomBorder tint>
                    <TableCell isTitle width={180}>
                        E-postadresse
                    </TableCell>
                    <TableCell>{rapportUser.email}</TableCell>
                </TableRow>

                <Spacer />
                {rapportEgenskaper.sertifikater.length > 0 && (
                    <SertifikatBlock
                        sertifikater={rapportEgenskaper.sertifikater}
                    />
                )}
                <Spacer />

                <TextBox text={infoText} />

                <Footer />
            </Page>
        );
    }
    return (
        <Page style={{ position: 'relative', top: 0, left: 0 }}>
            <View style={styles.container}>
                <Text>Det mangler data for generering av infoside</Text>
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
