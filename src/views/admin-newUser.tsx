import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Roles } from '../contracts/userApi';
import { UserSchema } from '../schema/user';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const NewUserView = () => {
    const classes = usePageStyles();

    const { newUser } = useUser();

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny bruker">
                            <div style={{ padding: 15 }}>
                                <UserSchema onSubmit={newUser} />
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default NewUserView;
