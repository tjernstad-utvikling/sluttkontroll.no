import { Card, CardContent, CardMenu } from '../components/card';
import {
    ClipboardCard,
    KontrollClipboard,
    PasteButton,
    SkjemaClipboard
} from '../components/clipboard';
import { Kontroll, Location } from '../contracts/kontrollApi';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '@mui/material/Button';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import { CommentModal } from '../modal/comment';
import Container from '@mui/material/Container';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import { KontrollEditModal } from '../modal/kontroll';
import { KontrollObjectViewParams } from '../contracts/navigation';
import { LocationEditSchema } from '../schema/location';
import { TableContainer } from '../tables/tableContainer';
import Typography from '@mui/material/Typography';
import { useAvvik } from '../data/avvik';
import { useClient } from '../data/klient';
import { useClipBoard } from '../data/clipboard';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollObjektView = () => {
    const { classes } = usePageStyles();
    const { objectId, klientId } = useParams<KontrollObjectViewParams>();
    const history = useHistory();

    const [loadedObjekt, setLoadedObjekt] = useState<number>();
    const [loadedAllObjekt, setLoadedAllObjekt] = useState<number>();
    const [_kontroller, setKontroller] = useState<Array<Kontroll>>([]);
    const [_location, setLocation] = useState<Location>();

    const [editLocation, setEditLocation] = useState<boolean>(false);

    const {
        state: { kontroller },
        loadKontrollerByObjekt,
        toggleStatusKontroll,
        showAllKontroller,
        setShowAllKontroller
    } = useKontroll();
    const {
        state: { klienter },
        saveEditLocation
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
        if (loadedObjekt !== Number(objectId)) {
            loadKontrollerByObjekt(Number(objectId));
            setLoadedObjekt(Number(objectId));
            loadUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadUsers, loadedObjekt, objectId]);

    useEffect(() => {
        if (loadedAllObjekt !== Number(objectId) && showAllKontroller) {
            loadKontrollerByObjekt(Number(objectId), showAllKontroller);
            setLoadedAllObjekt(Number(objectId));
            console.log('load all');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadedAllObjekt, objectId, showAllKontroller]);

    useEffect(() => {
        if (kontroller !== undefined) {
            setKontroller(
                kontroller.filter((k) => k.location.id === Number(objectId))
            );
        }
    }, [kontroller, objectId]);

    useEffect(() => {
        if (klienter !== undefined) {
            const klient = klienter.find((k) => k.id === Number(klientId));
            if (klient !== undefined) {
                setLocation(
                    klient.locations.find((o) => o.id === Number(objectId))
                );
            }
        }
    }, [kontroller, klientId, klienter, objectId]);

    const [editId, setEditId] = useState<number>();
    const [commentId, setCommentId] = useState<number | undefined>(undefined);

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

    /**
     * Clipboard
     */
    const {
        state: { kontrollToPast, skjemaToPast },
        openScissors,
        closeScissors,
        selectedKontroll,
        clipboardHasKontroll,
        clipboardHasSkjema
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
                                        },
                                        {
                                            label: showAllKontroller
                                                ? 'Vis kun åpne kontroller'
                                                : 'Vis alle kontroller',
                                            icon: <CallMergeIcon />,
                                            action: () =>
                                                setShowAllKontroller(
                                                    !showAllKontroller
                                                )
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
                                            kontroller={_kontroller}
                                            onSelected={onSelectForClipboard}
                                            leftAction={
                                                <PasteButton
                                                    clipboardHas={
                                                        clipboardHasKontroll
                                                    }
                                                    options={{
                                                        kontrollPaste: {
                                                            locationId:
                                                                Number(
                                                                    objectId
                                                                ),
                                                            klientId:
                                                                Number(
                                                                    klientId
                                                                ),
                                                            kontroll:
                                                                kontrollToPast
                                                        }
                                                    }}
                                                />
                                            }
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

export default KontrollObjektView;
