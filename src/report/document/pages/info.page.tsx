import { Page, StyleSheet, View } from '@react-pdf/renderer';
import {
    RapportEgenskaper,
    RapportUser,
    ReportSetting
} from '../../../contracts/reportApi';
import { TableCell, TableHeader, TableRow } from '../components/table';

import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { OutputData } from '@editorjs/editorjs';
import { SertifikatBlock } from '../components/sertifikat';
import { Spacer } from '../components/spacing';
import { Text } from '../components/text';
import { TextBox } from '../components/box';

interface InfoPageProps {
    reportSetting: ReportSetting | undefined;
    infoText: OutputData | undefined;
    rapportEgenskaper: RapportEgenskaper | undefined | null;
    rapportUser: RapportUser | undefined | null;
    hasClientModuleActive: boolean;
    hasControllerModuleActive: boolean;
    hasInfoModuleActive: boolean;
}
export const InfoPage = ({
    reportSetting,
    infoText,
    rapportEgenskaper,
    rapportUser,
    hasClientModuleActive,
    hasControllerModuleActive,
    hasInfoModuleActive
}: InfoPageProps): JSX.Element => {
    if (reportSetting && infoText && rapportEgenskaper && rapportUser) {
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
                {hasClientModuleActive && (
                    <>
                        <TableHeader title="Informasjon om inspeksjonssted" />

                        <TableRow tint>
                            <TableCell isTitle width={180}>
                                Oppdragsgiver
                            </TableCell>
                            <TableCell>
                                {rapportEgenskaper.oppdragsgiver}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell isTitle width={180}>
                                Kontrollsted
                            </TableCell>
                            <TableCell>
                                {rapportEgenskaper.kontrollsted}
                            </TableCell>
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
                            <TableCell>
                                {rapportEgenskaper.kontaktperson}
                            </TableCell>
                        </TableRow>
                        <TableRow tint>
                            <TableCell isTitle width={180}>
                                Telefonnummer
                            </TableCell>
                            <TableCell>
                                {rapportEgenskaper.kontaktTelefon}
                            </TableCell>
                        </TableRow>
                        <TableRow hasBottomBorder>
                            <TableCell isTitle width={180}>
                                E-postadresse
                            </TableCell>
                            <TableCell>
                                {rapportEgenskaper.kontaktEpost}
                            </TableCell>
                        </TableRow>
                        <Spacer />
                    </>
                )}
                {hasControllerModuleActive && (
                    <>
                        <TableHeader title="Kontrollert av" />
                        <TableRow tint>
                            <TableCell isTitle width={180}>
                                Kontroll??r
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
                    </>
                )}
                {hasInfoModuleActive && (
                    <TextBox text={infoText} statementImages={[]} />
                )}

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
