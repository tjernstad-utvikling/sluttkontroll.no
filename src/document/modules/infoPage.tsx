import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { Header } from './utils/header';

export const InfoPage = () => {
    return (
        <Page style={{ position: 'relative', top: 0, left: 0 }}>
            <Header />
            <View style={styles.container}></View>
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
