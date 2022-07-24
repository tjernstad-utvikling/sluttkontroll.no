import { Card, CardContent, CardMenu } from '../components/card';
import { UserTable, columns, defaultColumns } from '../tables/user';
import { useCurrentUser, useUsers } from '../api/hooks/useUsers';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/base/tableContainer';
import { usePageStyles } from '../styles/kontroll/page';

const UsersView = () => {
    const { classes } = usePageStyles();

    const currentUserData = useCurrentUser();

    const userData = useUsers();

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
                            <CardContent>
                                {currentUserData.data !== undefined ? (
                                    <TableContainer
                                        columns={columns({
                                            currentUser: currentUserData.data
                                        })}
                                        defaultColumns={defaultColumns}
                                        tableId="users">
                                        <UserTable
                                            isLoading={userData.isLoading}
                                            users={userData.data ?? []}
                                        />
                                    </TableContainer>
                                ) : (
                                    <div>Bruker mangler</div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default UsersView;
