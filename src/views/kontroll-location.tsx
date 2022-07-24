import { Card, CardContent, CardMenu } from '../components/card';
import {
    ClipboardCard,
    KontrollClipboard,
    PasteButton,
    SkjemaClipboard
} from '../components/clipboard';
import {
    useClients,
    useLocationById,
    useUpdateLocation
} from '../api/hooks/useKlient';
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
import { InstrumentSelectModal } from '../modal/instrumentSelect';
import { KontrollEditModal } from '../modal/kontroll';
import { KontrollObjectViewParams } from '../contracts/navigation';
import { KontrollTable } from '../tables/kontroll';
import { LocationEditSchema } from '../schema/location';
import { LocationImageCard } from '../components/location';
import { NewImageModal } from '../modal/newLocationImage';
import Typography from '@mui/material/Typography';
import { useAttachments } from '../api/hooks/useAttachments';
import { useAvvik } from '../api/hooks/useAvvik';
import { useClipBoard } from '../data/clipboard';
import { useKontroll as useKontrollCtx } from '../data/kontroll';
import { useMeasurements } from '../api/hooks/useMeasurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUsers } from '../api/hooks/useUsers';

const KontrollObjektView = () => {
    const { classes } = usePageStyles();
    const { objectId, klientId } = useParams<KontrollObjectViewParams>();
    const history = useHistory();

    const [isSelectModalOpen, setIsSelectModalOpen] = useState<
        number | undefined
    >(undefined);

    const [editLocation, setEditLocation] = useState<boolean>(false);
    const [addLocationImage, setAddLocationImage] = useState<boolean>(false);

    const { showAllKontroller, setShowAllKontroller } = useKontrollCtx();

    const kontrollData = useKontroller({
        includeDone: showAllKontroller,
        locationId: Number(objectId)
    });

    const attachmentsData = useAttachments({
        locationId: Number(objectId)
    });

    const statusMutation = useToggleKontrollStatus();

    function toggleStatusKontroll(kontrollId: number) {
        const kontroll = kontrollData.data?.find((k) => k.id === kontrollId);
        if (kontroll) statusMutation.mutateAsync({ kontroll });
    }
    const clientData = useClients();

    const locationData = useLocationById({
        clientId: Number(klientId),
        locationId: Number(objectId)
    });

    const userData = useUsers();

    const avvikData = useAvvik({
        includeClosed: true,
        locationId: Number(objectId)
    });

    const measurementData = useMeasurements({ locationId: Number(objectId) });

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

    const locationMutation = useUpdateLocation();
    const handleEditLocation = async (name: string): Promise<void> => {
        if (locationData.data !== undefined) {
            try {
                await locationMutation.mutateAsync({
                    clientId: Number(klientId),
                    locationId: Number(objectId),
                    name
                });
            } catch (error) {
                console.log(error);
            } finally {
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
                                            {locationData.data?.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {locationData.data && (
                                            <LocationImageCard
                                                klientId={Number(klientId)}
                                                location={locationData.data}
                                                openAddImageModal={() =>
                                                    setAddLocationImage(true)
                                                }
                                            />
                                        )}
                                    </Grid>
                                </Grid>

                                {editLocation &&
                                locationData.data !== undefined ? (
                                    <LocationEditSchema
                                        location={locationData.data}
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
                                <KontrollTable
                                    {...{
                                        users: userData.data ?? [],
                                        klienter: clientData.data ?? [],
                                        avvik: avvikData.data ?? [],
                                        measurements:
                                            measurementData.data ?? [],
                                        edit: editKontroll,
                                        toggleStatus: toggleStatusKontroll,
                                        clipboardHasSkjema,
                                        skjemaToPast,
                                        editComment: setCommentId,
                                        addAttachment:
                                            setKontrollAddAttachmentId,
                                        attachments: attachmentsData.data ?? [],
                                        openSelectInstrument:
                                            setIsSelectModalOpen
                                    }}
                                    kontroller={kontrollData.data ?? []}
                                    onSelected={onSelectForClipboard}
                                    loading={kontrollData.isLoading}
                                    leftAction={
                                        <PasteButton
                                            clipboardHas={clipboardHasKontroll}
                                            options={{
                                                kontrollPaste: {
                                                    locationId:
                                                        Number(objectId),
                                                    klientId: Number(klientId),
                                                    kontroll: kontrollToPast
                                                }
                                            }}
                                        />
                                    }
                                />
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
            <InstrumentSelectModal
                kontrollId={isSelectModalOpen ?? 0}
                open={!!isSelectModalOpen}
                close={() => {
                    setIsSelectModalOpen(undefined);
                }}
            />
        </div>
    );
};

export default KontrollObjektView;
