import { Card } from '../components/card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Roles } from '../contracts/userApi';
import { UserProfileSchema } from '../schema/userProfile';
import { useAuth } from '../hooks/useAuth';
import { usePageStyles } from '../styles/kontroll/page';

const ProfileView = () => {
    const { classes } = usePageStyles();

    const { user, updateUser, updatePassword } = useAuth();

    const handleUpdateUser = async (
        name: string,
        phone: string,
        email: string,
        password: string,
        changePassword: boolean,
        roles: Roles[] | undefined
    ) => {
        if (changePassword) {
            if (await updatePassword(password)) {
            }
        }
        if (await updateUser(name, email, phone, roles)) {
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
                        <Card title="Profil">
                            {user !== undefined && (
                                <div style={{ padding: 15 }}>
                                    <UserProfileSchema
                                        onSubmit={handleUpdateUser}
                                        user={user}
                                    />
                                </div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default ProfileView;
