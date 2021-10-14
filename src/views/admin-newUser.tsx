import { Card, CardContent } from '../components/card';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Roles } from '../contracts/userApi';
import { UserSchema } from '../schema/user';
import { useHistory } from 'react-router-dom';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const NewUserView = () => {
    const { classes } = usePageStyles();

    const history = useHistory();
    const { newUser } = useUser();
    const handleNewUser = async (
        name: string,
        phone: string,
        email: string,
        roles: Roles[] | undefined
    ) => {
        if (await newUser(name, email, phone, roles)) {
            history.goBack();
            return true;
        }
        return false;
    };
    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny bruker">
                            <CardContent>
                                <UserSchema onSubmit={handleNewUser} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default NewUserView;
