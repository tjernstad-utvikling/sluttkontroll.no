import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { getTemplates } from '../api/skjemaTemplateApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useTemplate } from '../data/skjemaTemplate';

const SettingsView = () => {
    const classes = usePageStyles();

    const { loadTemplates } = useTemplate();
    useEffectOnce(async () => {
        loadTemplates();
    });
    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Sjekkliste maler">
                            <div style={{ padding: 15 }}></div>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SettingsView;
