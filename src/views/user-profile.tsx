import { Card, CardContent } from '../components/card';
import { useCurrentUser, useUpdateCurrentUser } from '../api/hooks/useUsers';

import { CertificateList } from '../components/certificate';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Roles } from '../contracts/userApi';
import { UserProfileSchema } from '../schema/userProfile';
import { useAuth } from '../hooks/useAuth';
import { usePageStyles } from '../styles/kontroll/page';

const ProfileView = () => {
    const { classes } = usePageStyles();

    const { updatePassword, userHasRole } = useAuth();

    const currentUserData = useCurrentUser();

    const currentUserMutation = useUpdateCurrentUser();

    const handleUpdateUser = async (
        name: string,
        phone: string,
        email: string,
        password: string,
        changePassword: boolean,
        roles: Roles[] | undefined
    ) => {
        if (currentUserData.data) {
            if (changePassword) {
                if (await updatePassword(password)) {
                }
            }
            try {
                await currentUserMutation.mutateAsync({
                    name,
                    email,
                    phone,
                    roles:
                        roles !== undefined ? roles : currentUserData.data.roles
                });
            } catch (error) {
                console.log(error);
            } finally {
                return true;
            }
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
                            <CardContent>
                                {currentUserData.data !== undefined && (
                                    <div style={{ padding: 15 }}>
                                        <UserProfileSchema
                                            onSubmit={handleUpdateUser}
                                            user={currentUserData.data}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    {userHasRole([Roles.ROLE_ADMIN, Roles.ROLE_KONTROLL]) && (
                        <Grid item xs={12}>
                            <CertificateList user={currentUserData.data} />
                        </Grid>
                    )}
                </Grid>
            </Container>
        </>
    );
};

export default ProfileView;
