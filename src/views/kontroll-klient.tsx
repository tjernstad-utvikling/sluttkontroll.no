import { Card, CardMenu } from '../components/card';
import {
    ClipboardCard,
    KontrollClipboard,
    SkjemaClipboard
} from '../components/clipboard';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useClientById, useUpdateClient } from '../api/hooks/useKlient';
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
import { useAttachments } from '../api/hooks/useAttachments';
import { useAvvik } from '../api/hooks/useAvvik';
import { useClipBoard } from '../data/clipboard';
import { useKontroll as useKontrollCtx } from '../data/kontroll';
import { useMeasurements } from '../api/hooks/useMeasurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUsers } from '../api/hooks/useUsers';

const KontrollKlientView = () => {
    const { classes } = usePageStyles();

    const { klientId } = useParams<KontrollKlientViewParams>();
    const history = useHistory();

    const [editKlient, setEditKlient] = useState<boolean>(false);

    const { showAllKontroller, setShowAllKontroller } = useKontrollCtx();

    const kontrollData = useKontroller({
        includeDone: showAllKontroller,
        clientId: Number(klientId)
    });

    const attachmentsData = useAttachments({
        clientId: Number(klientId)
    });

    const statusMutation = useToggleKontrollStatus();

    function toggleStatusKontroll(kontrollId: number) {
        const kontroll = kontrollData.data?.find((k) => k.id === kontrollId);
        if (kontroll) statusMutation.mutateAsync({ kontroll });
    }

    const updateClientMutation = useUpdateClient();
    const clientData = useClientById({ clientId: Number(klientId) });

    const userData = useUsers();

    const avvikData = useAvvik({
        includeClosed: true,
        clientId: Number(klientId)
    });

    const measurementData = useMeasurements({ clientId: Number(klientId) });

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

    const handleEditKlient = async (name: string): Promise<void> => {
        try {
            await updateClientMutation.mutateAsync({
                name,
                clientId: Number(klientId)
            });
        } catch (error) {
            console.log(error);
        } finally {
            setEditKlient(false);
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
                                        Rediger kunde
                                    </Button>
                                ) : (
                                    <div />
                                )}
                                <div style={{ paddingBottom: '10px' }} />

                                <Typography paragraph>
                                    <strong>Kunde:</strong>{' '}
                                    {clientData.data?.name}
                                </Typography>
                                {editKlient && clientData.data !== undefined ? (
                                    <KlientEditSchema
                                        klient={clientData.data}
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
                                        users: userData.data ?? [],
                                        klienter: clientData.data
                                            ? [clientData.data]
                                            : [],
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
                                        attachments: attachmentsData.data ?? []
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="kontroller">
                                    <KontrollTable
                                        kontroller={kontrollData.data ?? []}
                                        onSelected={onSelectForClipboard}
                                        loading={kontrollData.isLoading}
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
        </div>
    );
};

export default KontrollKlientView;
