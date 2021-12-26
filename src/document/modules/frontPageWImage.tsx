import { Image, Page, StyleSheet, View } from '@react-pdf/renderer';

import { DateText } from './components/text';
import PdfLogo from '../../assets/pdf-logo.png';
import { ReportKontroll } from '../../contracts/kontrollApi';
import { ReportSetting } from '../../contracts/reportApi';
import { Text } from './components/text';

interface FrontPageProps {
    reportSetting: ReportSetting | undefined;
    kontroll: ReportKontroll | undefined;
    locationImageUrl: string | undefined;
}
export const FrontPageWImage = ({
    reportSetting,
    kontroll,
    locationImageUrl
}: FrontPageProps) => {
    if (reportSetting && kontroll) {
        return (
            <Page style={{ position: 'relative', top: 0, left: 0 }}>
                <View style={styles.container}>
                    <Image style={styles.topImage} src={locationImageUrl} />
                    <Image style={styles.logo} src={PdfLogo} />
                    <View style={styles.text}>
                        <Text style={styles.title}>{'Rapport '}</Text>
                        <Text style={styles.title}>
                            {reportSetting.reportTitle}
                        </Text>
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
        marginHorizontal: 190
    },
    topImage: {
        marginHorizontal: 0
    },
    title: {
        fontSize: '50px'
    },
    subText: {
        fontSize: '25px'
    },
    text: {
        alignItems: 'center'
    }
});
