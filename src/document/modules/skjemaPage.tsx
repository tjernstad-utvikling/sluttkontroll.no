import { Page, StyleSheet } from '@react-pdf/renderer';

import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';
import { Skjema } from '../../contracts/kontrollApi';
import { Spacer } from './components/spacing';
import { TableHeader } from './components/table';
import {SkjemaRow} from './components/skjema';
interface SkjemaPageProps {
    frontPageData: FrontPageData;
    skjemaer: Skjema[];
}
export const SkjemaPage = ({ frontPageData, skjemaer }: SkjemaPageProps) => {
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

            <TableHeader title="Kontrollskjema" />
            {skjemaer.map((s) => (
                <SkjemaRow nr={s.} />
            ))}

            <Spacer />

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
