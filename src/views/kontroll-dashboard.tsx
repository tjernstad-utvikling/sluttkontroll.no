import { Card, CardMenu } from '../components/card';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Kontroll } from '../contracts/kontrollApi';
import { KontrollEditModal } from '../modal/kontroll';
import { TableContainer } from '../tables/tableContainer';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useRouteMatch } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../data/user';

const KontrollerView = () => {
    const classes = usePageStyles();
    const { url } = useRouteMatch();
    const {
        state: { kontroller },
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
                        <Card title="Dine kontroller" menu={<CardMenu />}>
                            {kontroller !== undefined ? (
                                <TableContainer
                                    columns={kontrollColumns(
                                        users ?? [],
                                        url,
                                        editKontroll
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="kontroller">
                                    <KontrollTable
                                        users={users ?? []}
                                        kontroller={kontroller}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster kontroller</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <KontrollEditModal
                kontroll={{} as Kontroll}
                editId={editId}
                close={closeEdit}
            />
        </div>
    );
};

export default KontrollerView;
