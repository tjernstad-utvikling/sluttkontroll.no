import { Card, CardContent, CardMenu } from '../components/card';
import { Kontroll, Location } from '../contracts/kontrollApi';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import { KontrollEditModal } from '../modal/kontroll';
import { KontrollObjectViewParams } from '../contracts/navigation';
import { LocationEditSchema } from '../schema/location';
import { TableContainer } from '../tables/tableContainer';
import Typography from '@material-ui/core/Typography';
import { useAvvik } from '../data/avvik';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollObjektView = () => {
    const classes = usePageStyles();
    const { objectId, klientId } = useParams<KontrollObjectViewParams>();
    const history = useHistory();

    const [loadedObjekt, setLoadedObjekt] = useState<number>();
    const [_kontroller, setKontroller] = useState<Array<Kontroll>>([]);
    const [_location, setLocation] = useState<Location>();

    const [editLocation, setEditLocation] = useState<boolean>(false);

    const {
        state: { klienter, kontroller },
        loadKontrollerByObjekt,
        saveEditLocation
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

    useEffect(() => {
        if (klienter !== undefined) {
            const klient = klienter.find((k) => k.id === Number(klientId));
            if (klient !== undefined) {
                setLocation(
                    klient.objekts.find((o) => o.id === Number(objectId))
                );
            }
        }
    }, [kontroller, klientId, klienter, objectId]);

    const [editId, setEditId] = useState<number>();

    const editKontroll = (id: number) => {
        setEditId(id);
    };
    const closeEdit = () => {
        setEditId(undefined);
    };

    const handleEditLocation = async (name: string): Promise<void> => {
        if (_location !== undefined) {
            if (await saveEditLocation(name, Number(klientId), _location)) {
                setEditLocation(false);
            }
        }
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Lokasjon">
                            <CardContent>
                                {!editLocation ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            setEditLocation(!editLocation)
                                        }
                                        startIcon={<EditIcon />}>
                                        Rediger Lokasjon
                                    </Button>
                                ) : (
                                    <div />
                                )}
                                <div style={{ paddingBottom: '10px' }} />

                                <Typography paragraph>
                                    <strong>Lokasjon:</strong> {_location?.name}
                                </Typography>
                                {editLocation && _location !== undefined ? (
                                    <LocationEditSchema
                                        location={_location}
                                        onSubmit={handleEditLocation}
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
                                        users={users ?? []}
                                        avvik={avvik ?? []}
                                        measurements={measurements ?? []}
                                        klienter={klienter ?? []}
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
