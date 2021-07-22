import { Image, Page, StyleSheet, Text } from '@react-pdf/renderer';

import PdfFront from '../assets/pdf-front.png';

export const FrontPage = () => {
    return (
        <Page>
            <Image src={PdfFront} />
        </Page>
    );
};

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35
    },
    title: {
        fontSize: 24,
        textAlign: 'center'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40
    },
    subtitle: {
        fontSize: 18,
        margin: 12
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey'
    }
});
