import { Card, CardContent } from '../components/card';
import {
    useAddCheckpoint,
    useCheckpoints,
    useUpdateCheckpoint
} from '../api/hooks/useCheckpoint';
import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import { Checkpoint } from '../contracts/checkpointApi';
import { CheckpointSchema } from '../schema/checkpoint';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { errorHandler } from '../tools/errorHandler';
import { usePageStyles } from '../styles/kontroll/page';

const CheckpointView = () => {
    const { classes } = usePageStyles();

    const checkpointData = useCheckpoints();

    const [checkpoint, setCheckpoint] = useState<Checkpoint>();

    useEffect(() => {
        if (checkpointData?.data !== undefined) {
            setCheckpoint(checkpointData.data.find((c) => c.id === editId));
        }
    }, [checkpointData.data]);

    const newCheckpointMutation = useAddCheckpoint();

    const handleCheckpointSubmit = async ({
        checkpointNumber,
        groupCategory,
        mainCategory,
        prosedyre,
        prosedyreNr,
        tekst
    }: {
        prosedyre: string;
        prosedyreNr: string;
        tekst: string;
        mainCategory: string;
        groupCategory: number;
        checkpointNumber: number;
    }): Promise<boolean> => {
        try {
            await newCheckpointMutation.mutateAsync({
                mainCategory,
                groupCategory,
                checkpointNumber,
                prosedyre,
                prosedyreNr,
                tekst
            });
        } catch (error: any) {
            errorHandler(error);
        }
        return false;
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Nytt sjekkpunkt">
                            <CardContent>
                                <Dialog
                                    open={isOpen}
                                    onClose={close}
                                    aria-labelledby="add-Picture-Dialog"
                                    fullScreen>
                                    <DialogTitle id="add-Picture-Dialog">
                                        {editId ? 'Rediger' : 'Nytt'} sjekkpunkt
                                    </DialogTitle>
                                    <DialogContent>
                                        {checkpoint !== undefined ? (
                                            <CheckpointSchema
                                                onSubmit={onSubmit}
                                                checkpoint={checkpoint}
                                            />
                                        ) : (
                                            <CheckpointSchema
                                                onSubmit={onSubmit}
                                            />
                                        )}
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={close} color="error">
                                            Avbryt
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default CheckpointView;
