import { Card, CardContent } from '../components/card';

import { CheckpointSchema } from '../schema/checkpoint';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { errorHandler } from '../tools/errorHandler';
import { useAddCheckpoint } from '../api/hooks/useCheckpoint';
import { usePageStyles } from '../styles/kontroll/page';

const CheckpointNewView = () => {
    const { classes } = usePageStyles();

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
                                <CheckpointSchema
                                    onSubmit={handleCheckpointSubmit}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default CheckpointNewView;
