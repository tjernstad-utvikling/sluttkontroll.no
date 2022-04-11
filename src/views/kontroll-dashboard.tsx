import { Card, CardContent, CardMenu } from '../components/card';
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
import {
    useKontroller,
    useToggleKontrollStatus
} from '../api/hooks/useKontroll';

import AddIcon from '@mui/icons-material/Add';
import { AttachmentModal } from '../modal/attachment';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import { CommentModal } from '../modal/comment';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { InstrumentStatus } from '../components/instrument';
import { KontrollEditModal } from '../modal/kontroll';
import { TableContainer } from '../tables/tableContainer';
import { useAttachments } from '../api/hooks/useAttachments';
import { useAvvik } from '../api/hooks/useAvvik';
import { useClients } from '../api/hooks/useKlient';
import { useClipBoard } from '../data/clipboard';
import { useHistory } from 'react-router-dom';
import { useKontroll as useKontrollCtx } from '../data/kontroll';
import { useMeasurements } from '../api/hooks/useMeasurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUsers } from '../api/hooks/useUsers';

const KontrollerView = () => {
    const { classes } = usePageStyles();

    const history = useHistory();
    const { showAllKontroller, setShowAllKontroller } = useKontrollCtx();

    const kontrollData = useKontroller({ includeDone: showAllKontroller });

    const attachmentsData = useAttachments({
        myControl: true
    });

    const statusMutation = useToggleKontrollStatus();

    const clientData = useClients();

    const userData = useUsers();

    const avvikData = useAvvik({
        includeClosed: true,
        myControl: true
    });

    const measurementData = useMeasurements({ myControl: true });

    /**
     * Clipboard
     */
    const {
        state: { skjemaToPast },
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
        if (kontrollData.data)
            selectedKontroll(
                kontrollData.data.filter((kontroll) => {
                    return ids.includes(kontroll.id);
                })
            );
    };

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

    function toggleStatusKontroll(kontrollId: number) {
        const kontroll = kontrollData.data?.find((k) => k.id === kontrollId);
        if (kontroll) statusMutation.mutateAsync({ kontroll });
    }

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={
                            clipboardHasSkjema || clipboardHasKontroll ? 9 : 12
                        }>
                        <Card
                            title="Dine kontroller"
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
                                <InstrumentStatus />

                                <TableContainer
                                    columns={kontrollColumns({
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
                                        attachments: attachmentsData.data ?? []
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="kontroller">
                                    <KontrollTable
                                        kontroller={kontrollData.data ?? []}
                                        loading={kontrollData.isLoading}
                                        onSelected={onSelectForClipboard}
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
        </>
    );
};

export default KontrollerView;
