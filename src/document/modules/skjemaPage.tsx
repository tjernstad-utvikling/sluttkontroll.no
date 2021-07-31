import { Checklist, Skjema } from '../../contracts/kontrollApi';
import { Page, StyleSheet, Text } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

import { ChecklistRow } from './components/skjema';
import { Footer } from './utils/footer';
import { FrontPageData } from '../documentContainer';
import { Header } from './utils/header';
import { SjekklisteValueGetter } from '../../tables/sjekkliste';
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
    const [_checklists, setChecklists] = useState<Checklist[]>([]);

    useEffect(() => {
        setChecklists(
            checklists.sort((a, b) =>
                String(SjekklisteValueGetter(a).prosedyreNr()).localeCompare(
                    String(SjekklisteValueGetter(b).prosedyreNr()),
                    undefined,
                    { numeric: true, sensitivity: 'base' }
                )
            )
        );
    }, [checklists]);
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
            <Text style={{ paddingVertical: 5 }}>
                {skjema.area}, {skjema.omrade}
            </Text>
            <TableHeader title="Kontrollskjema" />
            {_checklists.map((checklist, index) => (
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
