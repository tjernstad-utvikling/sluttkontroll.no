import { Card, CardMenu } from '../components/card';
import { UserTable, columns, defaultColumns } from '../tables/user';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { TableContainer } from '../tables/tableContainer';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const UsersView = () => {
    const classes = usePageStyles();

    const {
        state: { users },
        loadUsers
    } = useUser();

    const { user } = useAuth();

    useEffectOnce(() => {
        loadUsers();
    });

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Brukere"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Ny  bruker',
                                            to: '/admin/users/new'
                                        }
                                    ]}
                                />
                            }>
                            {users !== undefined && user !== undefined ? (
                                <TableContainer
                                    columns={columns({ currentUser: user })}
                                    defaultColumns={defaultColumns}
                                    tableId="users">
                                    <UserTable users={users ?? []} />
                                </TableContainer>
                            ) : (
                                <div>Laster brukere</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default UsersView;
