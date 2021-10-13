import { Card } from '../components/card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { usePageStyles } from '../styles/kontroll/page';

const SettingsView = () => {
    const { classes } = usePageStyles();

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Innstillinger">
                            <div style={{ padding: 15 }}></div>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SettingsView;
