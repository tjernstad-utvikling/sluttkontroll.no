import { Card, CardMenu } from '../components/card';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { KontrollEditModal } from '../modal/kontroll';
import { KontrollKlientViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';
import { useUser } from '../data/user';

const KontrollKlientView = () => {
    const classes = usePageStyles();
    const { url } = useRouteMatch();
    const { klientId } = useParams<KontrollKlientViewParams>();
    const history = useHistory();
    const {
        state: { kontroller },
        loadKontrollerByKlient
    } = useKontroll();
    const {
        loadUsers,
        state: { users }
    } = useUser();

    useEffectOnce(() => {
        loadKontrollerByKlient(Number(klientId));
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
                        <Card
                            title="Kontroller"
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
            <KontrollEditModal editId={editId} close={closeEdit} />
        </div>
    );
};

export default KontrollKlientView;
