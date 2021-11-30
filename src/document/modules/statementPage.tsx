import { Page, StyleSheet } from '@react-pdf/renderer';

import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';
import { OutputData } from '@editorjs/editorjs';
import { TextBox } from './components/box';

interface StatementPageProps {
    statement: OutputData;
    frontPageData: FrontPageData;
}
export const StatementPage = ({
    statement,
    frontPageData
}: StatementPageProps) => {
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
