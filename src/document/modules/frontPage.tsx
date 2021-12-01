import { Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { FrontPageData } from '../documentContainer';
import PdfLogo from '../../assets/pdf-logo.png';

interface FrontPageProps {
    frontPageData: FrontPageData | undefined;
}
export const FrontPage = ({ frontPageData }: FrontPageProps) => {
    if (frontPageData !== undefined) {
        return (
            <Page style={{ position: 'relative', top: 0, left: 0 }}>
                <View style={styles.container}>
                    <View style={styles.text}>
                        <Text style={styles.title}>{'Rapport '}</Text>
                        <Text style={styles.title}>{frontPageData.title}</Text>
                    </View>
                    <View>
                        <Image style={styles.logo} src={PdfLogo} />
                    </View>
                    <View style={[styles.text, styles.subText]}>
                        <Text>{frontPageData.kontrollsted}</Text>
                        <Text>{frontPageData.date}</Text>
                        <Text>Den elektriske installasjon er vurdert av:</Text>
                        <Text>{frontPageData.user}</Text>
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
