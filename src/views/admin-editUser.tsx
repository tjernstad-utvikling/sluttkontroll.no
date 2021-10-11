import { Roles, User } from '../contracts/userApi';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Card } from '../components/card';
import Container from '@mui/material/Container';
import { EditUserViewParams } from '../contracts/navigation';
import Grid from '@mui/material/Grid';
import { UserSchema } from '../schema/user';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const NewUserView = () => {
    const classes = usePageStyles();
    const { userId } = useParams<EditUserViewParams>();
    const history = useHistory();
    const [user, setUser] = useState<User>();
    const {
        state: { users },
        updateUser
    } = useUser();
    useEffect(() => {
        const _user = users?.find((u) => u.id === Number(userId));
        if (_user !== undefined) {
            setUser(_user);
        }
    }, [userId, users]);
    const handleEditUser = async (
        name: string,
        phone: string,
        email: string,
        roles: Roles[] | undefined
    ) => {
        if (user !== undefined) {
            const _roles = roles !== undefined ? roles : user.roles;

            if (
                await updateUser({ ...user, name, phone, email, roles: _roles })
            ) {
                history.goBack();
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
                        <Card title="Rediger bruker">
                            <div style={{ padding: 15 }}>
                                {user !== undefined && (
                                    <UserSchema
                                        onSubmit={handleEditUser}
                                        user={user}
                                    />
                                )}
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default NewUserView;
