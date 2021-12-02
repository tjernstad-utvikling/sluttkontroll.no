import { Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { Footer } from './components/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './components/header';
import { OutputData } from '@editorjs/editorjs';
import { TextBox } from './components/box';

interface StatementPageProps {
    statement: OutputData | undefined;
    frontPageData: FrontPageData | undefined;
}
export const StatementPage = ({
    statement,
    frontPageData
}: StatementPageProps): JSX.Element => {
    if (statement && frontPageData) {
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

                <TextBox text={statement} />

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
