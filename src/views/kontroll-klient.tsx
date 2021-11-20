import { Card, CardMenu } from '../components/card';
import {
    ClipboardCard,
    KontrollClipboard,
    SkjemaClipboard
} from '../components/clipboard';
import { Klient, Kontroll } from '../contracts/kontrollApi';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import { CardContent } from '@mui/material';
import Container from '@mui/material/Container';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import { KlientEditSchema } from '../schema/klient';
import { KontrollEditModal } from '../modal/kontroll';
import { KontrollKlientViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import Typography from '@mui/material/Typography';
import { useAvvik } from '../data/avvik';
import { useClient } from '../data/klient';
import { useClipBoard } from '../data/clipboard';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollKlientView = () => {
    const { classes } = usePageStyles();

    const { klientId } = useParams<KontrollKlientViewParams>();
    const history = useHistory();

    const [loadedKlient, setLoadedKlient] = useState<number>();
    const [_kontroller, setKontroller] = useState<Array<Kontroll>>([]);
    const [_klient, setKlient] = useState<Klient>();

    const [editKlient, setEditKlient] = useState<boolean>(false);

    const {
        state: { kontroller },
        loadKontrollerByKlient,
        toggleStatusKontroll
    } = useKontroll();
    const {
        state: { klienter },
        saveEditKlient
    } = useClient();
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
                    (k) => k.location.klient.id === Number(klientId)
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

    /**
     * Clipboard
     */
    const {
        state: { skjemaToPast },
        openScissors,
        closeScissors,
        selectedKontroll,
        clipboardHasSkjema,
        clipboardHasKontroll
    } = useClipBoard();
    useEffect(() => {
        openScissors();
        return () => {
            closeScissors();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSelectForClipboard = (ids: number[]) => {
        selectedKontroll(
            _kontroller.filter((kontroll) => {
                return ids.includes(kontroll.id);
            })
        );
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
                    <Grid
                        item
                        xs={
                            clipboardHasSkjema || clipboardHasKontroll ? 9 : 12
                        }>
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
                            <CardContent>
                                {kontroller !== undefined ? (
                                    <TableContainer
                                        columns={kontrollColumns(
                                            users ?? [],
                                            klienter ?? [],
                                            avvik ?? [],
                                            measurements ?? [],
                                            editKontroll,
                                            toggleStatusKontroll,
                                            clipboardHasSkjema,
                                            skjemaToPast
                                        )}
                                        defaultColumns={defaultColumns}
                                        tableId="kontroller">
                                        <KontrollTable
                                            kontroller={_kontroller}
                                            onSelected={onSelectForClipboard}
                                        />
                                    </TableContainer>
                                ) : (
                                    <div>Laster kontroller</div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    {(clipboardHasSkjema || clipboardHasKontroll) && (
                        <ClipboardCard>
                            {clipboardHasKontroll && <KontrollClipboard />}
                            {clipboardHasSkjema && <SkjemaClipboard />}
                        </ClipboardCard>
                    )}
                </Grid>
            </Container>
            <KontrollEditModal editId={editId} close={closeEdit} />
        </div>
    );
};

export default KontrollKlientView;
