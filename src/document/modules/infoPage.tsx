import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';

interface InfoPageProps {
    frontPageData: FrontPageData;
}
export const InfoPage = ({ frontPageData }: InfoPageProps) => {
    return (
        <Page style={{ position: 'relative', top: 0, left: 0 }}>
            <Header
                title={frontPageData.title}
                location={frontPageData.kontrollsted}
                date={frontPageData.date}
            />
            <View style={styles.container}></View>
            <Footer />
        </Page>
    );
};

const styles = StyleSheet.create({
    container: {},
    logo: {
        marginHorizontal: 150
    },
    title: {
        fontSize: '20px'
    },
    subText: {
        fontSize: '30px'
    }
});
