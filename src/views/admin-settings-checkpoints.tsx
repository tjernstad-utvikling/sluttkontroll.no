import { Card, CardContent, CardMenu } from '../components/card';
import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';

import { Checkpoint } from '../contracts/checkpointApi';
import { CheckpointModal } from '../modal/checkpoint';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/tableContainer';
import { errorHandler } from '../tools/errorHandler';
import { newCheckpoints } from '../api/checkpointApi';
import { updateCheckpoints } from '../api/checkpointApi';
import { useCheckpoints } from '../api/hooks/useCheckpoint';
import { usePageStyles } from '../styles/kontroll/page';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

const CheckpointView = () => {
    const { classes } = usePageStyles();

    const checkpointData = useCheckpoints();

    const [editId, setEditId] = useState<number | undefined>(undefined);
    const [addNew, setAddNew] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

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
                const c = checkpointData.data?.find((c) => c.id === editId);
                if (c !== undefined) {
                    handleSaveResponse(status, {
                        ...c,
                        prosedyre,
                        prosedyreNr,
                        tekst,
                        gruppe
                    });
                }
            } catch (error: any) {
                errorHandler(error);
                enqueueSnackbar('Problemer med lagring av mal', {
                    variant: 'error'
                });
            }
            return false;
        } else {
            try {
                const { status, checkpoint } = await newCheckpoints(
                    prosedyre,
                    prosedyreNr,
                    tekst,
                    gruppe
                );

                if (checkpoint !== undefined) {
                    handleSaveResponse(status, checkpoint);
                }
            } catch (error: any) {
                errorHandler(error);
                enqueueSnackbar('Problemer med lagring av mal', {
                    variant: 'error'
                });
            }
            return false;
        }
    };

    const handleSaveResponse = (
        status: number,
        checkpoint: Checkpoint
    ): boolean => {
        if (status === 200) {
            setCheckpoints((prev) => [...prev, checkpoint]);
            enqueueSnackbar('Sjekkpunkt lagret', {
                variant: 'success'
            });
            setAddNew(false);
            return true;
        }
        if (status === 204) {
            setCheckpoints((prev) =>
                prev.map((c) => {
                    if (c.id === editId) {
                        return checkpoint;
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
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Sjekkpunkter"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Nytt sjekkpunkt',
                                            action: () => setAddNew(!addNew)
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                <TableContainer
                                    columns={columns({
                                        onEditCheckpoint: (checkpointId) =>
                                            setEditId(checkpointId),
                                        editCheckpoint: true
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="checkpoints">
                                    <CheckpointTable
                                        isLoading={checkpointData.isLoading}
                                        checkpoints={checkpointData.data ?? []}
                                    />
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <CheckpointModal
                onSubmit={handleCheckpointSubmit}
                editId={editId}
                isOpen={addNew}
                close={() => setEditId(undefined)}
                checkpoints={checkpointData.data}
            />
        </>
    );
};

export default CheckpointView;
