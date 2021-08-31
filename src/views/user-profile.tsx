import { Card, CardMenu } from '../components/card';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useAuth } from '../hooks/useAuth';
import { usePageStyles } from '../styles/kontroll/page';

const ProfileView = () => {
    const classes = usePageStyles();

    const { user } = useAuth();

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Profil" menu={<CardMenu items={[]} />}>
                            <div />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default ProfileView;
