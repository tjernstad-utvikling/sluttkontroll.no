import { Card, CardContent } from '../components/card';

import { CertificateList } from '../components/certificate';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Roles } from '../contracts/userApi';
import { Sertifikat } from '../contracts/certificateApi';
import { UserProfileSchema } from '../schema/userProfile';
import { useAuth } from '../hooks/useAuth';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const ProfileView = () => {
    const { classes } = usePageStyles();

    const { user, updateUser, updatePassword, userHasRole } = useAuth();

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

    const { updateUserInState } = useUser();

    const handleAddCertificateToUser = (certificate: Sertifikat) => {
        if (user) {
            updateUserInState({
                ...user,
                sertifikater: [...user.sertifikater, certificate]
            });
        }
    };
    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Profil">
                            <CardContent>
                                {user !== undefined && (
                                    <div style={{ padding: 15 }}>
                                        <UserProfileSchema
                                            onSubmit={handleUpdateUser}
                                            user={user}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    {userHasRole([Roles.ROLE_ADMIN, Roles.ROLE_KONTROLL]) && (
                        <Grid item xs={12}>
                            <CertificateList
                                addCertificate={handleAddCertificateToUser}
                                user={user}
                            />
                        </Grid>
                    )}
                </Grid>
            </Container>
        </>
    );
};

export default ProfileView;
