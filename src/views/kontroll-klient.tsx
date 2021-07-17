import { Card, CardMenu } from '../components/card';
import { Klient, Kontroll } from '../contracts/kontrollApi';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { CardContent } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { KontrollEditModal } from '../modal/kontroll';
import { KontrollKlientViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import Typography from '@material-ui/core/Typography';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollKlientView = () => {
    const classes = usePageStyles();
    const { url } = useRouteMatch();
    const { klientId } = useParams<KontrollKlientViewParams>();
    const history = useHistory();

    const [loadedKlient, setLoadedKlient] = useState<number>();
    const [_kontroller, setKontroller] = useState<Array<Kontroll>>([]);
    const [_klient, setKlient] = useState<Klient>();

    const {
        state: { kontroller, klienter },
        loadKontrollerByKlient
    } = useKontroll();
    const {
        loadUsers,
        state: { users }
    } = useUser();

    useEffect(() => {
        if (loadedKlient !== Number(klientId)) {
            loadKontrollerByKlient(Number(klientId));
            setLoadedKlient(Number(klientId));
            loadUsers();
        }
    }, [klientId, loadKontrollerByKlient, loadUsers, loadedKlient]);

    useEffect(() => {
        if (kontroller !== undefined) {
            setKontroller(
                kontroller.filter(
                    (k) => k.Objekt.klient.id === Number(klientId)
                )
            );
        }
    }, [kontroller, klientId]);
    useEffect(() => {
        if (klienter !== undefined) {
            setKlient(klienter.find((k) => k.id === Number(klientId)));
        }
    }, [kontroller, klientId, klienter]);

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
                        <Card title="Klient">
                            <CardContent>
                                <div style={{ flex: 1, flexDirection: 'row' }}>
                                    <Typography paragraph>
                                        <strong>Klient:</strong> {_klient?.name}
                                    </Typography>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        edge="start">
                                        <EditIcon />
                                    </IconButton>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
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

export default KontrollKlientView;
