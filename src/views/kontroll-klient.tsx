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
import { Klient } from '../contracts/kontrollApi';
import { KlientEditSchema } from '../schema/klient';
import { KontrollEditModal } from '../modal/kontroll';
import { KontrollKlientViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import Typography from '@mui/material/Typography';
import { useAvvik } from '../api/hooks/useAvvik';
import { useClient } from '../data/klient';
import { useClipBoard } from '../data/clipboard';
import { useKontroll as useKontrollCtx } from '../data/kontroll';
import { useMeasurements } from '../api/hooks/useMeasurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollKlientView = () => {
    const { classes } = usePageStyles();

    const { klientId } = useParams<KontrollKlientViewParams>();
    const history = useHistory();

    const [loadedKlient, setLoadedKlient] = useState<number>();

    const [_klient, setKlient] = useState<Klient>();

    const [editKlient, setEditKlient] = useState<boolean>(false);

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
        saveEditKlient
    } = useClient();
    const {
        loadUsers,
        state: { users }
    } = useUser();

    const avvikData = useAvvik({
        includeClosed: true,
        clientId: Number(klientId)
    });

    const measurementData = useMeasurements({ clientId: Number(klientId) });

    useEffect(() => {
        if (loadedKlient !== Number(klientId)) {
            loadUsers();
            setLoadedKlient(Number(klientId));
        }
    }, [klientId, loadUsers, loadedKlient, showAllKontroller]);

    useEffect(() => {
        if (klienter !== undefined) {
            setKlient(klienter.find((k) => k.id === Number(klientId)));
        }
    }, [klientId, klienter]);

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
                                    <strong>Kunde:</strong> {_klient?.name}
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
                                        avvik: avvikData.data ?? [],
                                        measurements:
                                            measurementData.data ?? [],
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
