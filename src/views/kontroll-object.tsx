import { Card, CardMenu } from '../components/card';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Kontroll } from '../contracts/kontrollApi';
import { KontrollEditModal } from '../modal/kontroll';
import { KontrollObjectViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollObjektView = () => {
    const classes = usePageStyles();
    const { url } = useRouteMatch();
    const { objectId } = useParams<KontrollObjectViewParams>();
    const history = useHistory();

    const [loadedObjekt, setLoadedObjekt] = useState<number>();
    const [_kontroller, setKontroller] = useState<Array<Kontroll>>([]);

    const {
        state: { kontroller },
        loadKontrollerByObjekt
    } = useKontroll();
    const {
        loadUsers,
        state: { users }
    } = useUser();

    useEffect(() => {
        if (loadedObjekt !== Number(objectId)) {
            loadKontrollerByObjekt(Number(objectId));
            setLoadedObjekt(Number(objectId));
            loadUsers();
        }
    }, [loadKontrollerByObjekt, loadUsers, loadedObjekt, objectId]);

    useEffect(() => {
        if (kontroller !== undefined) {
            setKontroller(
                kontroller.filter((k) => k.Objekt.id === Number(objectId))
            );
        }
    }, [kontroller, objectId]);

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

export default KontrollObjektView;
