import { Card, CardMenu } from '../components/card';
import { SkjemaTable, columns, defaultColumns } from '../tables/skjema';
import { useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Skjema } from '../contracts/kontrollApi';
import { SkjemaEditModal } from '../modal/skjema';
import { SkjemaerViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useAvvik } from '../data/avvik';
import { useConfirm } from '../hooks/useConfirm';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';

const SkjemaerView = () => {
    const { classes } = usePageStyles();
    const { kontrollId } = useParams<SkjemaerViewParams>();
    const { url } = useRouteMatch();

    const { confirm } = useConfirm();

    const [_skjemaer, setSkjemaer] = useState<Array<Skjema>>([]);
    const {
        state: { skjemaer, kontroller },
        loadKontroller,
        removeSkjema
    } = useKontroll();

    const {
        state: { avvik }
    } = useAvvik();

    const {
        state: { measurements }
    } = useMeasurement();

    useEffectOnce(() => {
        loadKontroller();
    });

    const [editId, setEditId] = useState<number>();

    useEffect(() => {
        if (skjemaer !== undefined) {
            setSkjemaer(
                skjemaer.filter((s) => s.kontroll.id === Number(kontrollId))
            );
        }
    }, [skjemaer, kontrollId]);

    const deleteSkjema = async (skjemaId: number) => {
        const skjema = skjemaer?.find((s) => s.id === skjemaId);
        if (skjema !== undefined) {
            const isConfirmed = await confirm(
                `Slette ${skjema.area} - ${skjema.omrade}?`
            );

            if (isConfirmed) {
                removeSkjema(skjemaId);
            }
        }
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Skjemaer"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Nytt skjema',
                                            to: `${url}/skjema/new`
                                        }
                                    ]}
                                />
                            }>
                            {skjemaer !== undefined ? (
                                <TableContainer
                                    columns={columns(
                                        kontroller ?? [],
                                        avvik ?? [],
                                        measurements ?? [],
                                        url,
                                        deleteSkjema,
                                        setEditId
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="skjemaer">
                                    <SkjemaTable
                                        skjemaer={_skjemaer}
                                        kontroller={kontroller ?? []}
                                        avvik={avvik ?? []}
                                        measurements={measurements ?? []}
                                        onSelected={() => console.log()}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster skjemaer</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <SkjemaEditModal
                editId={editId}
                close={() => setEditId(undefined)}
            />
        </>
    );
};

export default SkjemaerView;
