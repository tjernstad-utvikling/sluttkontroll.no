import { Card, CardContent } from '../components/card';
import {
    useCheckpoints,
    useUpdateCheckpoint
} from '../api/hooks/useCheckpoint';
import { useEffect, useState } from 'react';

import { AdminCheckpointEditViewParams } from '../contracts/navigation';
import { Checkpoint } from '../contracts/checkpointApi';
import { CheckpointSchema } from '../schema/checkpoint';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { errorHandler } from '../tools/errorHandler';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';

const CheckpointEditView = () => {
    const { classes } = usePageStyles();

    const { checkpointId } = useParams<AdminCheckpointEditViewParams>();

    const checkpointData = useCheckpoints();

    const [checkpoint, setCheckpoint] = useState<Checkpoint>();

    useEffect(() => {
        if (checkpointData?.data !== undefined) {
            setCheckpoint(
                checkpointData.data.find((c) => c.id === Number(checkpointId))
            );
        }
    }, [checkpointData.data, checkpointId]);

    const updateCheckpointMutation = useUpdateCheckpoint();

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
            await updateCheckpointMutation.mutateAsync({
                checkpointId: Number(checkpointId),
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
                                <CheckpointSchema
                                    onSubmit={handleCheckpointSubmit}
                                    checkpoint={checkpoint}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default CheckpointEditView;
