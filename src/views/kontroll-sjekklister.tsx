import {
    AvvikClipboard,
    ClipboardCard,
    KontrollClipboard
} from '../components/clipboard';
import { Card, CardContent, CardMenu } from '../components/card';
import {
    SjekklisteTable,
    SjekklisteValueGetter,
    columns,
    defaultColumns
} from '../tables/sjekkliste';
import { useChecklists, useToggleApplicable } from '../api/hooks/useChecklist';
import { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { Checklist } from '../contracts/kontrollApi';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { SjekklisterViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useAvvik } from '../api/hooks/useAvvik';
import { useClipBoard } from '../data/clipboard';
import { usePageStyles } from '../styles/kontroll/page';

const SjekklisterView = () => {
    const { classes } = usePageStyles();
    const { skjemaId } = useParams<SjekklisterViewParams>();

    const history = useHistory();
    let { url } = useRouteMatch();

    const [_checklists, setChecklists] = useState<Checklist[]>([]);

    const checklistData = useChecklists({
        skjemaId: Number(skjemaId)
    });

    const avvikData = useAvvik({
        includeClosed: true,
        skjemaId: Number(skjemaId)
    });

    useEffect(() => {
        if (checklistData.data !== undefined) {
            setChecklists(
                checklistData.data.sort((a, b) =>
                    String(
                        SjekklisteValueGetter(a).prosedyreNr()
                    ).localeCompare(
                        String(SjekklisteValueGetter(b).prosedyreNr()),
                        undefined,
                        { numeric: true, sensitivity: 'base' }
                    )
                )
            );
        }
    }, [checklistData.data]);

    const toggleMutation = useToggleApplicable();

    async function toggleAktuellChecklist(checklistId: number) {
        const checklist = checklistData.data?.find((c) => c.id === checklistId);
        if (!checklist) return;

        await toggleMutation.mutateAsync({
            applicable: !checklist.aktuell,
            checklist
        });
    }

    /**
     * Clipboard
     */
    const {
        state: { avvikToPast },
        clipboardHasAvvik,
        clipboardHasKontroll
    } = useClipBoard();

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={clipboardHasAvvik || clipboardHasKontroll ? 9 : 12}>
                        <Card
                            title="Sjekkliste"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Legg til / fjerne sjekkpunkter',
                                            action: () =>
                                                history.push(
                                                    `${url}/edit-checklist`
                                                )
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                <TableContainer
                                    columns={columns(
                                        avvikData.data ?? [],
                                        url,
                                        toggleAktuellChecklist,
                                        clipboardHasAvvik,
                                        avvikToPast
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="checklists">
                                    <SjekklisteTable
                                        checklists={_checklists}
                                        isLoading={
                                            checklistData.isLoading ||
                                            avvikData.isLoading
                                        }
                                    />
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    {(clipboardHasAvvik || clipboardHasKontroll) && (
                        <ClipboardCard>
                            {clipboardHasKontroll && <KontrollClipboard />}
                            {clipboardHasAvvik && <AvvikClipboard />}
                        </ClipboardCard>
                    )}
                </Grid>
            </Container>
        </div>
    );
};

export default SjekklisterView;
