import { Card, CardContent, CardMenu } from '../components/card';
import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';
import {
    useAddCheckpoint,
    useCheckpoints,
    useUpdateCheckpoint
} from '../api/hooks/useCheckpoint';

import { CheckpointModal } from '../modal/checkpoint';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/base/tableContainer';
import { errorHandler } from '../tools/errorHandler';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const CheckpointView = () => {
    const { classes } = usePageStyles();

    const checkpointData = useCheckpoints();

    const [editId, setEditId] = useState<number | undefined>(undefined);
    const [addNew, setAddNew] = useState<boolean>(false);

    const newCheckpointMutation = useAddCheckpoint();
    const updateCheckpointMutation = useUpdateCheckpoint();

    const handleCheckpointSubmit = async (
        prosedyre: string,
        prosedyreNr: string,
        tekst: string,
        gruppe: string
    ): Promise<boolean> => {
        if (editId !== undefined) {
            try {
                await updateCheckpointMutation.mutateAsync({
                    checkpointId: editId,
                    gruppe,
                    prosedyre,
                    prosedyreNr,
                    tekst
                });
            } catch (error: any) {
                errorHandler(error);
            }
            return false;
        } else {
            try {
                await newCheckpointMutation.mutateAsync({
                    prosedyre,
                    prosedyreNr,
                    tekst,
                    gruppe
                });
            } catch (error: any) {
                errorHandler(error);
            }
            return false;
        }
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
                isOpen={addNew || !!editId}
                close={() => {
                    setEditId(undefined);
                    setAddNew(false);
                }}
                checkpoints={checkpointData.data}
            />
        </>
    );
};

export default CheckpointView;
