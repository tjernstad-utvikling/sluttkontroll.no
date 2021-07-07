import { Card, CardMenu } from '../components/card';
import {
    SjekklisteTable,
    SjekklisteValueGetter,
    columns,
    defaultColumns
} from '../tables/sjekkliste';
import { useEffect, useState } from 'react';

import { Checklist } from '../contracts/kontrollApi';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { SjekklisterViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';

const SjekklisterView = () => {
    const classes = usePageStyles();
    const { skjemaId } = useParams<SjekklisterViewParams>();

    const [_checklists, setChecklists] = useState<Array<Checklist>>([]);
    const {
        state: { checklists },
        loadKontroller
    } = useKontroll();

    useEffectOnce(() => {
        loadKontroller();
    });

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

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Sjekkliste" menu={<CardMenu />}>
                            {checklists !== undefined ? (
                                <TableContainer
                                    columns={columns('')}
                                    defaultColumns={defaultColumns}
                                    tableId="checklists">
                                    <SjekklisteTable checklists={_checklists} />
                                </TableContainer>
                            ) : (
                                <div>Laster skjemaer</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default SjekklisterView;