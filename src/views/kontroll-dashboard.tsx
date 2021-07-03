import { Card, CardMenu } from '../components/card';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { KontrollTable } from '../components/kontroll';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollerView = () => {
    const classes = usePageStyles();
    const {
        state: { kontroller },
        loadKontroller
    } = useKontroll();
    const { loadUsers } = useUser();

    useEffectOnce(() => {
        loadKontroller();
        loadUsers();
    });

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Kontroller" menu={<CardMenu />}>
                            {kontroller !== undefined ? (
                                <KontrollTable kontroller={kontroller} />
                            ) : (
                                <div>Venter på kontroller</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default KontrollerView;
