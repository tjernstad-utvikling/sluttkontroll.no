import { Card, CardMenu } from '../components/card';
import { Klient, Kontroll } from '../contracts/kontrollApi';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import { CardContent } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import { KlientEditSchema } from '../schema/klient';
import { KontrollEditModal } from '../modal/kontroll';
import { KontrollKlientViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import Typography from '@material-ui/core/Typography';
import { useAvvik } from '../data/avvik';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollKlientView = () => {
    const classes = usePageStyles();

    const { klientId } = useParams<KontrollKlientViewParams>();
    const history = useHistory();

    const [loadedKlient, setLoadedKlient] = useState<number>();
    const [_kontroller, setKontroller] = useState<Array<Kontroll>>([]);
    const [_klient, setKlient] = useState<Klient>();

    const [editKlient, setEditKlient] = useState<boolean>(false);

    const {
        state: { kontroller, klienter },
        loadKontrollerByKlient,
        saveEditKlient
    } = useKontroll();
    const {
        loadUsers,
        state: { users }
    } = useUser();

    const {
        state: { avvik }
    } = useAvvik();

    const {
        state: { measurements }
    } = useMeasurement();

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

    const handleEditKlient = async (name: string): Promise<void> => {
        if (_klient !== undefined) {
            if (await saveEditKlient(name, _klient)) {
                setEditKlient(false);
            }
        }
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Klient">
                            <CardContent>
                                {!editKlient ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            setEditKlient(!editKlient)
                                        }
                                        startIcon={<EditIcon />}>
                                        Rediger klient
                                    </Button>
                                ) : (
                                    <div />
                                )}
                                <div style={{ paddingBottom: '10px' }} />

                                <Typography paragraph>
                                    <strong>Klient:</strong> {_klient?.name}
                                </Typography>
                                {editKlient && _klient !== undefined ? (
                                    <KlientEditSchema
                                        klient={_klient}
                                        onSubmit={handleEditKlient}
                                    />
                                ) : (
                                    <div />
                                )}
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
                                        klienter ?? [],
                                        avvik ?? [],
                                        measurements ?? [],
                                        editKontroll
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="kontroller">
                                    <KontrollTable
                                        klienter={klienter ?? []}
                                        avvik={avvik ?? []}
                                        users={users ?? []}
                                        measurements={measurements ?? []}
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
