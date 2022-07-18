import { Image, Page, StyleSheet, View } from '@react-pdf/renderer';
import { ReportKontroll, ReportSetting } from '../../contracts/reportApi';

import { DateText } from '../components/text';
import PdfLogo from '../../assets/pdf-logo.png';
import { Text } from '../components/text';

interface FrontPageProps {
    reportSetting: ReportSetting | undefined;
    kontroll: ReportKontroll | undefined;
}
export const FrontPage = ({ reportSetting, kontroll }: FrontPageProps) => {
    if (reportSetting && kontroll) {
        return (
            <Page style={{ position: 'relative', top: 0, left: 0 }}>
                <View style={styles.container}>
                    <View style={styles.text}>
                        <Text style={styles.title}>{'Rapport '}</Text>
                        <Text style={styles.title}>
                            {reportSetting.reportTitle}
                        </Text>
                    </View>
                    <View>
                        <Image style={styles.logo} src={PdfLogo} />
                    </View>
                    <View style={[styles.text, styles.subText]}>
                        <Text>{reportSetting.reportSite}</Text>
                        <DateText>{reportSetting.reportDate}</DateText>
                        <Text>Den elektriske installasjon er vurdert av:</Text>
                        <Text>
                            {kontroll.rapportEgenskaper?.rapportUser?.name}
                        </Text>
                    </View>
                </View>
            </Page>
        );
    }
    return (
        <Page style={{ position: 'relative', top: 0, left: 0 }}>
            <View style={styles.container}>
                <Text>Det mangler data for generering av forside</Text>
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        position: 'absolute',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        top: 0,
        left: 0,
        height: '29cm'
    },
    logo: {
        marginHorizontal: 150
    },
    title: {
        fontSize: '60px'
    },
    subText: {
        fontSize: '30px'
    },
    text: {
        alignItems: 'center'
    }
});
