import { Card, CardContent, CardMenu } from '../components/card';
import {
    ClipboardCard,
    KontrollClipboard,
    PasteButton,
    SkjemaClipboard
} from '../components/clipboard';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    useKontroller,
    useToggleKontrollStatus
} from '../api/hooks/useKontroll';

import AddIcon from '@mui/icons-material/Add';
import { AttachmentModal } from '../modal/attachment';
import Button from '@mui/material/Button';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import { CommentModal } from '../modal/comment';
import Container from '@mui/material/Container';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import { KontrollEditModal } from '../modal/kontroll';
import { KontrollObjectViewParams } from '../contracts/navigation';
import { Location } from '../contracts/kontrollApi';
import { LocationEditSchema } from '../schema/location';
import { LocationImageCard } from '../components/location';
import { NewImageModal } from '../modal/newLocationImage';
import { TableContainer } from '../tables/tableContainer';
import Typography from '@mui/material/Typography';
import { useAvvik } from '../data/avvik';
import { useClient } from '../data/klient';
import { useClipBoard } from '../data/clipboard';
import { useKontroll as useKontrollCtx } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollObjektView = () => {
    const { classes } = usePageStyles();
    const { objectId, klientId } = useParams<KontrollObjectViewParams>();
    const history = useHistory();

    const [loadedObjekt, setLoadedObjekt] = useState<number>();

    const [_location, setLocation] = useState<Location>();

    const [editLocation, setEditLocation] = useState<boolean>(false);
    const [addLocationImage, setAddLocationImage] = useState<boolean>(false);

    const { showAllKontroller, setShowAllKontroller } = useKontrollCtx();

    const kontrollData = useKontroller({
        includeDone: showAllKontroller,
        clientId: Number(klientId)
    });

    const statusMutation = useToggleKontrollStatus();

    function toggleStatusKontroll(kontrollId: number) {
        const kontroll = kontrollData.data?.find((k) => k.id === kontrollId);
        if (kontroll) statusMutation.mutateAsync({ kontroll });
    }

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
            setLoadedObjekt(Number(objectId));
            loadUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadUsers, loadedObjekt, objectId]);

    useEffect(() => {
        if (klienter !== undefined) {
            const klient = klienter.find((k) => k.id === Number(klientId));
            if (klient !== undefined) {
                setLocation(
                    klient.locations.find((o) => o.id === Number(objectId))
                );
            }
        }
    }, [klientId, klienter, objectId]);

    const [editId, setEditId] = useState<number>();
    const [commentId, setCommentId] = useState<number | undefined>(undefined);
    const [kontrollAddAttachmentId, setKontrollAddAttachmentId] = useState<
        number | undefined
    >(undefined);

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
            kontrollData.data?.filter((kontroll) => {
                return ids.includes(kontroll.id);
            }) ?? []
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
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        {!editLocation ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() =>
                                                    setEditLocation(
                                                        !editLocation
                                                    )
                                                }
                                                startIcon={<EditIcon />}>
                                                Rediger Lokasjon
                                            </Button>
                                        ) : (
                                            <div />
                                        )}
                                        <div
                                            style={{ paddingBottom: '10px' }}
                                        />

                                        <Typography paragraph>
                                            <strong>Lokasjon:</strong>{' '}
                                            {_location?.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {_location && (
                                            <LocationImageCard
                                                klientId={Number(klientId)}
                                                location={_location}
                                                openAddImageModal={() =>
                                                    setAddLocationImage(true)
                                                }
                                            />
                                        )}
                                    </Grid>
                                </Grid>

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
                                            icon: <AddIcon />,
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
                                <TableContainer
                                    columns={kontrollColumns({
                                        users: users ?? [],
                                        klienter: klienter ?? [],
                                        avvik: avvik ?? [],
                                        measurements: measurements ?? [],
                                        edit: editKontroll,
                                        toggleStatus: toggleStatusKontroll,
                                        clipboardHasSkjema,
                                        skjemaToPast,
                                        editComment: setCommentId,
                                        addAttachment:
                                            setKontrollAddAttachmentId
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="kontroller">
                                    <KontrollTable
                                        kontroller={kontrollData.data ?? []}
                                        onSelected={onSelectForClipboard}
                                        loading={kontrollData.isLoading}
                                        leftAction={
                                            <PasteButton
                                                clipboardHas={
                                                    clipboardHasKontroll
                                                }
                                                options={{
                                                    kontrollPaste: {
                                                        locationId:
                                                            Number(objectId),
                                                        klientId:
                                                            Number(klientId),
                                                        kontroll: kontrollToPast
                                                    }
                                                }}
                                            />
                                        }
                                    />
                                </TableContainer>
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
            <AttachmentModal
                kontrollId={kontrollAddAttachmentId}
                close={() => setKontrollAddAttachmentId(undefined)}
            />
            <NewImageModal
                klientId={Number(klientId)}
                locationId={Number(objectId)}
                open={addLocationImage}
                close={() => setAddLocationImage(false)}
            />
        </div>
    );
};

export default KontrollObjektView;
