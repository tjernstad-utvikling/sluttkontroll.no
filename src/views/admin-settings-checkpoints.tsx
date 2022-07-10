import { Card, CardContent, CardMenu } from '../components/card';

import { CheckpointTable } from '../tables/checkpoint';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useCheckpoints } from '../api/hooks/useCheckpoint';
import { usePageStyles } from '../styles/kontroll/page';

const CheckpointView = () => {
    const { classes } = usePageStyles();

    const checkpointData = useCheckpoints();

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
                                            to: '/admin/settings/checkpoint/new'
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                <CheckpointTable
                                    isLoading={checkpointData.isLoading}
                                    checkpoints={checkpointData.data ?? []}
                                    editCheckpoint
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default CheckpointView;
