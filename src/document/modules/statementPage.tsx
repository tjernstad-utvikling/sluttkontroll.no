import { FrontPageData, Image } from '../documentContainer';
import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { Footer } from './utils/footer';
import { Header } from './utils/header';
import { OutputData } from '@editorjs/editorjs';
import { TextBox } from './components/box';

interface StatementPageProps {
    statement: OutputData | undefined;
    frontPageData: FrontPageData | undefined;
    images: Image[];
}
export const StatementPage = ({
    statement,
    frontPageData,
    images
}: StatementPageProps): JSX.Element => {
    if (statement && frontPageData && images) {
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

                <TextBox text={statement} images={images} />

                <Footer />
            </Page>
        );
    }
    return (
        <Page style={{ position: 'relative', top: 0, left: 0 }}>
            <View style={styles.container}>
                <Text>Det mangler data for generering av tekst side</Text>
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
