import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { KontrollTable } from '../components/kontroll';
import Paper from '@material-ui/core/Paper';
import { useEffect } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';

const KontrollerView = () => {
    const classes = usePageStyles();
    const {
        state: { kontroller },
        loadKontroller
    } = useKontroll();
    useEffectOnce(() => {
        loadKontroller();
    });
    useEffect(() => {
        console.log(kontroller);
    }, [kontroller]);
    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {kontroller !== undefined ? (
                                <KontrollTable kontroller={kontroller} />
                            ) : (
                                <div>Venter på kontroller</div>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default KontrollerView;
