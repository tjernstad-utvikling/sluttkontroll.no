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
import { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { Checklist } from '../contracts/kontrollApi';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { SjekklisterViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useAvvik } from '../data/avvik';
import { useClipBoard } from '../data/clipboard';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';

const SjekklisterView = () => {
    const { classes } = usePageStyles();
    const { skjemaId } = useParams<SjekklisterViewParams>();

    const history = useHistory();
    let { url } = useRouteMatch();

    const [_checklists, setChecklists] = useState<Array<Checklist>>([]);
    const {
        state: { checklists },
        toggleAktuellChecklist
    } = useKontroll();

    const {
        state: { avvik }
    } = useAvvik();

    useEffect(() => {
        if (checklists !== undefined) {
            setChecklists(
                checklists
                    .filter((c) => c.skjema.id === Number(skjemaId))
                    .sort((a, b) =>
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
    }, [checklists, skjemaId]);

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
                                {checklists !== undefined ? (
                                    <TableContainer
                                        columns={columns(
                                            avvik ?? [],
                                            url,
                                            toggleAktuellChecklist,
                                            clipboardHasAvvik,
                                            avvikToPast
                                        )}
                                        defaultColumns={defaultColumns}
                                        tableId="checklists">
                                        <SjekklisteTable
                                            checklists={_checklists}
                                        />
                                    </TableContainer>
                                ) : (
                                    <div>Laster skjemaer</div>
                                )}
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
