import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';

import { Card } from '../components/card';
import { Checkpoint } from '../contracts/checkpointApi';
import { CheckpointModal } from '../modal/checkpoint';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { TableContainer } from '../tables/tableContainer';
import { getCheckpoints } from '../api/checkpointApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const CheckpointView = () => {
    const classes = usePageStyles();

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [editId, setEditId] = useState<number | undefined>(undefined);

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
