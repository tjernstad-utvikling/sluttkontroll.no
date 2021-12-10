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

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import { CardContent } from '@mui/material';
import { CommentModal } from '../modal/comment';
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
        toggleStatusKontroll,
        showAllKontroller,
        setShowAllKontroller
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
            loadKontrollerByKlient(Number(klientId), showAllKontroller);
            setLoadedKlient(Number(klientId));
            loadUsers();
        }
    }, [
        klientId,
        loadKontrollerByKlient,
        loadUsers,
        loadedKlient,
        showAllKontroller
    ]);

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
    const [commentId, setCommentId] = useState<number | undefined>(undefined);

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
                                            icon: <AddIcon />,
                                            action: () =>
                                                history.push('/kontroll/new')
                                        },
                                        {
                                            label: showAllKontroller
                                                ? 'Vis kun åpne kontroller'
                                                : 'Vis alle kontroller',
                                            icon: <CallMergeIcon />,
                                            action: () => {
                                                if (!showAllKontroller)
                                                    loadKontrollerByKlient(
                                                        Number(klientId),
                                                        true
                                                    );
                                                setShowAllKontroller(
                                                    !showAllKontroller
                                                );
                                            }
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
                                            skjemaToPast,
                                            setCommentId
                                        )}
                                        defaultColumns={defaultColumns}
                                        tableId="kontroller">
                                        <KontrollTable
                                            kontroller={_kontroller.filter(
                                                (k) => {
                                                    if (showAllKontroller) {
                                                        return true;
                                                    }
                                                    return k.done !== true;
                                                }
                                            )}
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
            <CommentModal
                kontrollId={commentId}
                open={commentId ? true : false}
                close={() => setCommentId(undefined)}
            />
        </div>
    );
};

export default KontrollKlientView;
