import { Image, Page, StyleSheet, View } from '@react-pdf/renderer';

import PdfFront from '../assets/pdf-front.png';
import PdfLogo from '../assets/pdf-logo.png';

export const FrontPage = () => {
    return (
        <Page>
            <Image
                style={{
                    position: 'absolute',
                    minWidth: '100%',
                    minHeight: '100%',
                    height: '100%',
                    width: '100%'
                }}
                src={PdfFront}
            />
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 200
                }}>
                <Image src={PdfLogo} />
            </View>
        </Page>
    );
};

const styles = StyleSheet.create({
    logo: {}
});
