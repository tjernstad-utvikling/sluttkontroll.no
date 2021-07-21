import { AvvikTable, columns, defaultColumns } from '../tables/avvik';
import { Card, CardMenu } from '../components/card';
import { useEffect, useState } from 'react';

import { Avvik } from '../contracts/avvikApi';
import { AvvikViewParams } from '../contracts/navigation';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { TableContainer } from '../tables/tableContainer';
import { useAvvik } from '../data/avvik';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';

const AvvikView = () => {
    const classes = usePageStyles();
    const { kontrollId, skjemaId, checklistId } = useParams<AvvikViewParams>();

    const [_avvik, setAvvik] = useState<Array<Avvik>>([]);
    const [newModalOpen, setNewModalOpen] = useState<boolean>(false);
    const {
        state: { skjemaer, kontroller },
        loadKontroller
    } = useKontroll();

    const {
        state: { avvik }
    } = useAvvik();

    useEffectOnce(() => {
        loadKontroller();
    });

    useEffect(() => {
        if (avvik !== undefined) {
            if (checklistId !== undefined) {
                setAvvik(
                    avvik.filter((a) => a.checklist.id === Number(checklistId))
                );
            } else if (skjemaId !== undefined) {
                setAvvik(
                    avvik.filter(
                        (a) => a.checklist.skjema.id === Number(skjemaId)
                    )
                );
            } else {
                setAvvik(
                    avvik.filter(
                        (a) =>
                            a.checklist.skjema.kontroll.id ===
                            Number(kontrollId)
                    )
                );
            }
        }
    }, [avvik, checklistId, kontrollId, skjemaId]);

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Målinger"
                            menu={
                                checklistId !== undefined && (
                                    <CardMenu
                                        items={[
                                            {
                                                label: 'Nytt avvik',
                                                action: () =>
                                                    setNewModalOpen(
                                                        !newModalOpen
                                                    )
                                            }
                                        ]}
                                    />
                                )
                            }>
                            {skjemaer !== undefined ? (
                                <TableContainer
                                    columns={columns(
                                        kontroller ?? [],
                                        skjemaer ?? []
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="avvik">
                                    <AvvikTable
                                        skjemaer={skjemaer}
                                        kontroller={kontroller ?? []}
                                        avvik={_avvik ?? []}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster avvik</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default AvvikView;
