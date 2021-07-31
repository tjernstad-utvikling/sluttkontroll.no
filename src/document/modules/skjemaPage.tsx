import { Checklist, Skjema } from '../../contracts/kontrollApi';
import { Page, StyleSheet } from '@react-pdf/renderer';

import { ChecklistRow } from './components/skjema';
import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';
import { Spacer } from './components/spacing';
import { TableHeader } from './components/table';

interface SkjemaPageProps {
    frontPageData: FrontPageData;
    skjema: Skjema;
    checklists: Checklist[];
}
export const SkjemaPage = ({
    frontPageData,
    skjema,
    checklists
}: SkjemaPageProps) => {
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
            {checklists.map((checklist, index) => (
                <ChecklistRow
                    isEvenIndex={index % 2 === 0}
                    key={checklist.id}
                    nr={checklist.checkpoint.prosedyreNr}
                    prosedyre={checklist.checkpoint.prosedyre}
                    status={'OK still'}
                />
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
