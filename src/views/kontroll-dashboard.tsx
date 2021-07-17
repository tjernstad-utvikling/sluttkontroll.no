import { Card, CardMenu } from '../components/card';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Kontroll } from '../contracts/kontrollApi';
import { KontrollEditModal } from '../modal/kontroll';
import { TableContainer } from '../tables/tableContainer';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollerView = () => {
    const classes = usePageStyles();
    const { url } = useRouteMatch();
    const history = useHistory();
    const { user } = useAuth();

    const [_kontroller, setKontroller] = useState<Array<Kontroll>>([]);

    const {
        state: { kontroller, klienter },
        loadKontroller
    } = useKontroll();
    const {
        loadUsers,
        state: { users }
    } = useUser();

    useEffectOnce(() => {
        loadKontroller();
        loadUsers();
    });

    useEffect(() => {
        if (kontroller !== undefined) {
            setKontroller(kontroller.filter((k) => k.user.id === user?.id));
        }
    }, [kontroller, user?.id]);

    const [editId, setEditId] = useState<number>();

    const editKontroll = (id: number) => {
        setEditId(id);
    };
    const closeEdit = () => {
        setEditId(undefined);
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Dine kontroller"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Ny kontroll',
                                            action: () =>
                                                history.push('/kontroll/new')
                                        }
                                    ]}
                                />
                            }>
                            {kontroller !== undefined ? (
                                <TableContainer
                                    columns={kontrollColumns(
                                        users ?? [],
                                        klienter ?? [],
                                        url,
                                        editKontroll
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="kontroller">
                                    <KontrollTable
                                        klienter={klienter ?? []}
                                        users={users ?? []}
                                        kontroller={_kontroller}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster kontroller</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <KontrollEditModal editId={editId} close={closeEdit} />
        </div>
    );
};

export default KontrollerView;
