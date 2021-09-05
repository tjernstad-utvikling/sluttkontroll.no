import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';

import { Card } from '../components/card';
import { Checkpoint } from '../contracts/checkpointApi';
import { CheckpointModal } from '../modal/checkpoint';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { TableContainer } from '../tables/tableContainer';
import { getCheckpoints } from '../api/checkpointApi';
import { updateCheckpoints } from '../api/checkpointApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

const CheckpointView = () => {
    const classes = usePageStyles();

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [editId, setEditId] = useState<number | undefined>(undefined);

    const { enqueueSnackbar } = useSnackbar();

    useEffectOnce(async () => {
        try {
            const res = await getCheckpoints();
            if (res.status === 200) {
                setCheckpoints(
                    res.checkpoints.sort((a, b) =>
                        String(a.prosedyreNr).localeCompare(
                            String(b.prosedyreNr),
                            undefined,
                            { numeric: true, sensitivity: 'base' }
                        )
                    )
                );
            }
        } catch (error: any) {
            console.error(error);
        }
    });

    const handleCheckpointSubmit = async (
        prosedyre: string,
        prosedyreNr: string,
        tekst: string,
        gruppe: string
    ): Promise<boolean> => {
        if (editId !== undefined) {
            try {
                const { status } = await updateCheckpoints(
                    editId,
                    prosedyre,
                    prosedyreNr,
                    tekst,
                    gruppe
                );

                if (status === 200) {
                    enqueueSnackbar('Sjekkpunkt lagret', {
                        variant: 'success'
                    });
                    return true;
                }
                if (status === 204) {
                    setCheckpoints((prev) =>
                        prev.map((c) => {
                            if (c.id === editId) {
                                return {
                                    ...c,
                                    prosedyre,
                                    prosedyreNr,
                                    tekst,
                                    gruppe
                                };
                            }
                            return c;
                        })
                    );
                    enqueueSnackbar('Sjekkpunkt lagret', {
                        variant: 'success'
                    });
                    setEditId(undefined);
                    return true;
                }
                if (status === 400) {
                    enqueueSnackbar('Et eller flere felter mangler', {
                        variant: 'warning'
                    });
                    return false;
                }

                enqueueSnackbar('Ukjent feil ved lagring av mal', {
                    variant: 'warning'
                });
                return false;
            } catch (error: any) {
                console.log(error);
                enqueueSnackbar('Problemer med lagring av mal', {
                    variant: 'error'
                });
            }
            return false;
        }
        return false;
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Sjekkpunkter">
                            {checkpoints !== undefined ? (
                                <TableContainer
                                    columns={columns({
                                        onEditCheckpoint: (checkpointId) =>
                                            setEditId(checkpointId),
                                        editCheckpoint: true
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="checkpoints">
                                    <CheckpointTable
                                        checkpoints={checkpoints}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster sjekkpunkter</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <CheckpointModal
                onSubmit={handleCheckpointSubmit}
                editId={editId}
                close={() => setEditId(undefined)}
                checkpoints={checkpoints}
            />
        </>
    );
};

export default CheckpointView;
