import {
    AvvikClipboard,
    ClipboardCard,
    KontrollClipboard,
    PasteButton
} from '../components/clipboard';
import { AvvikTable, columns, defaultColumns } from '../tables/avvik';
import { Card, CardContent, CardMenu } from '../components/card';
import {
    useAvvik,
    useCloseAvvik,
    useDeleteAvvik,
    useOpenAvvik
} from '../api/hooks/useAvvik';
import { useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import { AvvikCommentModal } from '../modal/avvikComment';
import { AvvikEditModal } from '../modal/avvik';
import { AvvikGrid } from '../components/avvik';
import { AvvikUtbedrereModal } from '../modal/avvikUtbedrere';
import { AvvikViewParams } from '../contracts/navigation';
import BuildIcon from '@mui/icons-material/Build';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ReorderIcon from '@mui/icons-material/Reorder';
import { StorageKeys } from '../contracts/keys';
import { TableContainer } from '../tables/base/tableContainer';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import { getAvvikReport } from '../api/avvikApi';
import { useClipBoard } from '../data/clipboard';
import { useConfirm } from '../hooks/useConfirm';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useHotkeys } from 'react-hotkeys-hook';
import { useKontrollById } from '../api/hooks/useKontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useSkjemaer } from '../api/hooks/useSkjema';

enum Modals {
    utbedrer,
    comment
}

const AvvikView = () => {
    const { classes } = usePageStyles();
    const { kontrollId, skjemaId, checklistId } = useParams<AvvikViewParams>();

    const { url } = useRouteMatch();

    const [selected, setSelected] = useState<number[]>([]);
    const [selectedFromGrid, setSelectedFromGrid] = useState<boolean>(false);

    const [showTable, setShowTable] = useState<boolean>(false);
    const [showAll, setShowAll] = useState<boolean>(false); // Also show closed avvik

    /**
     * Hotkeys
     */
    useHotkeys('t', () => changeViewMode(true)); // change to table
    useHotkeys('k', () => changeViewMode(false)); // change to card
    /***** */

    const [modalOpen, setModalOpen] = useState<Modals>();

    const [editId, setEditId] = useState<number>();

    const kontrollData = useKontrollById(Number(kontrollId));

    const skjemaData = useSkjemaer({ kontrollId: Number(kontrollId) });

    const { confirm } = useConfirm();

    const avvikData = useAvvik({
        includeClosed: showAll,
        ...(checklistId
            ? { checklistId: Number(checklistId) }
            : skjemaId
            ? { skjemaId: Number(skjemaId) }
            : kontrollId
            ? { kontrollId: Number(kontrollId) }
            : {})
    });
    const deleteMutation = useDeleteAvvik();

    const askToDeleteAvvik = async (avvikId: number) => {
        const isConfirmed = await confirm(`Slette avvikID: ${avvikId}?`);

        if (isConfirmed) {
            await deleteMutation.mutateAsync({
                avvikId
            });
        }
    };

    const close = async (avvikId: number) => {
        const avvikToClose = avvikData.data?.find((a) => a.id === avvikId);
        if (avvikToClose !== undefined) {
            setSelected([avvikToClose.id]);
            setModalOpen(Modals.comment);
        }
    };

    const changeViewMode = (newMode: boolean) => {
        localStorage.setItem(
            StorageKeys.avvikViewMode,
            JSON.stringify(newMode)
        );
        setShowTable(newMode);
    };
    const changeViewAll = () => {
        localStorage.setItem(
            StorageKeys.avvikViewAll,
            JSON.stringify(!showAll)
        );
        setShowAll(!showAll);
    };

    const downloadAvvikList = async () => {
        try {
            const response = await getAvvikReport(Number(kontrollId), selected);

            const fileURL = window.URL.createObjectURL(
                new Blob([response.data])
            );
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'Avviksliste.pdf');
            document.body.appendChild(fileLink);
            fileLink.click();
        } catch (error) {}
    };

    useEffectOnce(() => {
        const jsonShowTable = localStorage.getItem(StorageKeys.avvikViewMode);
        if (jsonShowTable !== null) {
            setShowTable(JSON.parse(jsonShowTable));
        }
        const jsonShowAll = localStorage.getItem(StorageKeys.avvikViewAll);
        if (jsonShowAll !== null) {
            setShowAll(JSON.parse(jsonShowAll));
        }
    });

    /**
     * Clipboard
     */
    const {
        state: { avvikToPast, skjemaClipboard },
        openScissors,
        closeScissors,
        selectedAvvik,
        clipboardHasAvvik,
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
        if (avvikData.data)
            selectedAvvik(
                avvikData.data?.filter((avvik) => {
                    return ids.includes(avvik.id);
                })
            );
    };
    const closeAvvikMutation = useCloseAvvik({ isFromDetailsPage: false });

    async function closeAvvik(selectedAvvik: number[], kommentar: string) {
        try {
            await closeAvvikMutation.mutateAsync({
                avvikList: selectedAvvik,
                kommentar
            });
            return true;
        } catch (error) {
            return false;
        }
    }
    const openAvvikMutation = useOpenAvvik({ isFromDetailsPage: false });

    async function openAvvik(avvikId: number) {
        try {
            await openAvvikMutation.mutateAsync({
                avvikId
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={clipboardHasAvvik || clipboardHasKontroll ? 9 : 12}>
                        <Card
                            title="Avvik"
                            menu={
                                <CardMenu
                                    count={selected.length}
                                    items={[
                                        {
                                            label: 'Nytt avvik',
                                            skip: checklistId === undefined,
                                            icon: <AddIcon />,
                                            to: `${url}/new`
                                        },
                                        {
                                            label: showTable
                                                ? 'Bytt visningsmodus (Grid)'
                                                : 'Bytt visningsmodus (Tabell)',
                                            icon: showTable ? (
                                                <ViewComfyIcon />
                                            ) : (
                                                <ReorderIcon />
                                            ),
                                            action: () =>
                                                changeViewMode(!showTable)
                                        },
                                        {
                                            label: showAll
                                                ? 'Vis kun åpne avvik'
                                                : 'Vis alle avvik',
                                            icon: <CallMergeIcon />,
                                            action: () => changeViewAll()
                                        },
                                        {
                                            label: `Sett utbedrere (${selected.length})`,
                                            icon: <PersonIcon />,
                                            action: () =>
                                                setModalOpen(Modals.utbedrer)
                                        },
                                        {
                                            label: `Lukk valgte avvik (${selected.length})`,
                                            icon: <BuildIcon />,
                                            action: () =>
                                                setModalOpen(Modals.comment)
                                        },
                                        {
                                            label: `Hent avviksliste (${selected.length})`,
                                            icon: <PictureAsPdfIcon />,
                                            action: downloadAvvikList
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                <TableContainer
                                    columns={columns({
                                        kontroller: kontrollData.data
                                            ? [kontrollData.data]
                                            : [],
                                        skjemaer: skjemaData.data ?? [],
                                        url,
                                        deleteSkjema: askToDeleteAvvik,
                                        edit: setEditId,
                                        open: openAvvik,
                                        close
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="avvik">
                                    {showTable ? (
                                        <AvvikTable
                                            avvik={avvikData.data ?? []}
                                            selected={selected}
                                            onSelected={(avvik) => {
                                                setSelected(avvik);
                                                onSelectForClipboard(avvik);
                                                setSelectedFromGrid(false);
                                            }}
                                            isLoading={avvikData.isLoading}
                                            skjemaClipboard={skjemaClipboard}
                                            leftAction={
                                                checklistId !== undefined && (
                                                    <PasteButton
                                                        clipboardHas={
                                                            clipboardHasAvvik
                                                        }
                                                        options={{
                                                            avvikPaste: {
                                                                checklistId:
                                                                    Number(
                                                                        checklistId
                                                                    ),
                                                                avvik: avvikToPast
                                                            }
                                                        }}
                                                    />
                                                )
                                            }
                                        />
                                    ) : (
                                        <AvvikGrid
                                            deleteAvvik={askToDeleteAvvik}
                                            edit={setEditId}
                                            open={openAvvik}
                                            close={close}
                                            avvik={avvikData.data ?? []}
                                            isLoading={avvikData.isLoading}
                                            selected={selected}
                                            setSelected={(a) => {
                                                setSelected(a);
                                                onSelectForClipboard(a);
                                                setSelectedFromGrid(true);
                                            }}
                                            selectedFromGrid={selectedFromGrid}
                                            url={url}
                                            leftAction={
                                                checklistId !== undefined && (
                                                    <PasteButton
                                                        clipboardHas={
                                                            clipboardHasAvvik
                                                        }
                                                        options={{
                                                            avvikPaste: {
                                                                checklistId:
                                                                    Number(
                                                                        checklistId
                                                                    ),
                                                                avvik: avvikToPast
                                                            }
                                                        }}
                                                    />
                                                )
                                            }
                                        />
                                    )}
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    {(clipboardHasAvvik || clipboardHasKontroll) && (
                        <ClipboardCard>
                            {clipboardHasKontroll && <KontrollClipboard />}
                            {clipboardHasAvvik && <AvvikClipboard />}
                        </ClipboardCard>
                    )}
                </Grid>
            </Container>
            <AvvikEditModal
                close={() => {
                    setEditId(undefined);
                }}
                editId={editId}
            />
            <AvvikUtbedrereModal
                open={modalOpen === Modals.utbedrer}
                close={() => setModalOpen(undefined)}
                selectedAvvik={selected}
                kontrollId={Number(kontrollId)}
            />
            <AvvikCommentModal
                open={modalOpen === Modals.comment}
                close={() => setModalOpen(undefined)}
                selectedAvvik={selected}
                closeAvvik={closeAvvik}
            />
        </>
    );
};

export default AvvikView;
