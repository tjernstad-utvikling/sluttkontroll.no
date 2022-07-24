import { Card, CardContent } from '../components/card';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Roles } from '../contracts/userApi';
import { UserSchema } from '../schema/user';
import { useHistory } from 'react-router-dom';
import { useNewUser } from '../api/hooks/useUsers';
import { usePageStyles } from '../styles/kontroll/page';

const NewUserView = () => {
    const { classes } = usePageStyles();

    const history = useHistory();

    const newUserMutation = useNewUser();

    const handleNewUser = async (
        name: string,
        phone: string,
        email: string,
        roles: Roles[] | undefined
    ) => {
        try {
            await newUserMutation.mutateAsync({
                email,
                name,
                phone,
                roles
            });
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            history.goBack();
            return true;
        }
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
