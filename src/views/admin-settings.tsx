import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { usePageStyles } from '../styles/kontroll/page';

const SettingsView = () => {
    const classes = usePageStyles();

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <button
                            onClick={(e) => {
                                throw new Error();
                            }}>
                            Test error reporting
                        </button>
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
