import { Card, CardContent, CardMenu } from '../components/card';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { usePageStyles } from '../styles/kontroll/page';

const ExternalDashboardView = () => {
    const { classes } = usePageStyles();

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Dine kontroller"
                            menu={<CardMenu items={[]} />}>
                            <CardContent>
                                <div></div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default ExternalDashboardView;
