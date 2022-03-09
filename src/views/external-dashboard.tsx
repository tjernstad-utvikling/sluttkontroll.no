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

import AddIcon from '@mui/icons-material/Add';
import { AttachmentModal } from '../modal/attachment';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import { CommentModal } from '../modal/comment';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { InstrumentStatus } from '../components/instrument';
import { Kontroll } from '../contracts/kontrollApi';
import { KontrollEditModal } from '../modal/kontroll';
import { TableContainer } from '../tables/tableContainer';
import { useAuth } from '../hooks/useAuth';
import { useAvvik } from '../data/avvik';
import { useClient } from '../data/klient';
import { useClipBoard } from '../data/clipboard';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useHistory } from 'react-router-dom';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const ExternalDashboardView = () => {
    const { classes } = usePageStyles();

    const history = useHistory();
    const { user } = useAuth();

    const [_kontroller, setKontroller] = useState<Kontroll[]>([]);

    const {
        state: { kontroller },
        loadKontroller,
        toggleStatusKontroll,
        showAllKontroller,
        setShowAllKontroller
    } = useKontroll();
    const {
        state: { klienter }
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

    useEffectOnce(() => {
        loadKontroller();
        loadUsers();
    });

    useEffect(() => {
        loadKontroller(showAllKontroller);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAllKontroller]);

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
        selectedKontroll(
            _kontroller.filter((kontroll) => {
                return ids.includes(kontroll.id);
            })
        );
    };

    useEffect(() => {
        if (kontroller !== undefined) {
            setKontroller(kontroller.filter((k) => k.user.id === user?.id));
        }
    }, [kontroller, user?.id]);

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
                                {kontroller !== undefined ? (
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
            <AttachmentModal
                kontrollId={kontrollAddAttachmentId}
                close={() => setKontrollAddAttachmentId(undefined)}
            />
        </>
    );
};

export default ExternalDashboardView;
