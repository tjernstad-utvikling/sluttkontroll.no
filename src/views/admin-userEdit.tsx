import { Card, CardContent } from '../components/card';
import { useHistory, useParams } from 'react-router-dom';
import { useUpdateUser, useUserById } from '../api/hooks/useUsers';

import { CertificateList } from '../components/certificate';
import Container from '@mui/material/Container';
import { EditUserViewParams } from '../contracts/navigation';
import Grid from '@mui/material/Grid';
import { Roles } from '../contracts/userApi';
import { Sertifikat } from '../contracts/certificateApi';
import { UserSchema } from '../schema/user';
import { usePageStyles } from '../styles/kontroll/page';

const NewUserView = () => {
    const { classes } = usePageStyles();
    const { userId } = useParams<EditUserViewParams>();
    const history = useHistory();

    const updateUserMutation = useUpdateUser();

    const userData = useUserById({ userId: Number(userId) });

    const handleEditUser = async (
        name: string,
        phone: string,
        email: string,
        roles: Roles[] | undefined
    ) => {
        if (userData.data !== undefined) {
            const _roles = roles !== undefined ? roles : userData.data.roles;

            try {
                await updateUserMutation.mutateAsync({
                    user: {
                        ...userData.data,
                        name,
                        phone,
                        email,
                        roles: _roles
                    }
                });
            } catch (error) {
                console.log(error);
            } finally {
                history.goBack();
                return true;
            }
        }
        return false;
    };

    const handleAddCertificateToUser = (certificate: Sertifikat) => {
        if (userData.data) {
            updateUserInState({
                ...userData.data,
                sertifikater: [...userData.data.sertifikater, certificate]
            });
        }
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Rediger bruker">
                            <CardContent>
                                {userData.data !== undefined && (
                                    <UserSchema
                                        onSubmit={handleEditUser}
                                        user={userData.data}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <CertificateList
                            addCertificate={handleAddCertificateToUser}
                            user={userData.data}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default NewUserView;
