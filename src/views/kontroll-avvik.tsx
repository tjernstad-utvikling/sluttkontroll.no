import { AvvikTable, columns, defaultColumns } from '../tables/avvik';
import { Card, CardMenu } from '../components/card';
import { useEffect, useState } from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';
import { Avvik } from '../contracts/avvikApi';
import { AvvikCommentModal } from '../modal/avvikComment';
import { AvvikEditModal } from '../modal/avvik';
import { AvvikGrid } from '../components/avvik';
import { AvvikUtbedrereModal } from '../modal/avvikUtbedrere';
import { AvvikViewParams } from '../contracts/navigation';
import BuildIcon from '@material-ui/icons/Build';
import CallMergeIcon from '@material-ui/icons/CallMerge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import ReorderIcon from '@material-ui/icons/Reorder';
import { StorageKeys } from '../contracts/keys';
import { TableContainer } from '../tables/tableContainer';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import { getAvvikReport } from '../api/avvikApi';
import { useAvvik } from '../data/avvik';
import { useConfirm } from '../hooks/useConfirm';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';

const AvvikView = () => {
    const classes = usePageStyles();
    const { kontrollId, skjemaId, checklistId } = useParams<AvvikViewParams>();

    const { url } = useRouteMatch();

    const [_avvik, setAvvik] = useState<Array<Avvik>>([]);
    const [selected, setSelected] = useState<Avvik[]>([]);
    const [selectedFromGrid, setSelectedFromGrid] = useState<boolean>(false);

    const [showTable, setShowTable] = useState<boolean>(false);
    const [showAll, setShowAll] = useState<boolean>(false); // Also show closed avvik

    enum Modals {
        utbedrer,
        comment
    }
    const [modalOpen, setModalOpen] = useState<Modals>();

    const [editId, setEditId] = useState<number>();

    const {
        state: { skjemaer, kontroller },
        loadKontroller
    } = useKontroll();

    const { confirm } = useConfirm();
    const {
        state: { avvik },
        deleteAvvik,
        openAvvik
    } = useAvvik();

    useEffectOnce(() => {
        loadKontroller();
    });

    useEffect(() => {
        if (avvik !== undefined) {
            let filteredAvvik;
            if (checklistId !== undefined) {
                filteredAvvik = avvik.filter(
                    (a) => a.checklist.id === Number(checklistId)
                );
            } else if (skjemaId !== undefined) {
                filteredAvvik = avvik.filter(
                    (a) => a.checklist.skjema.id === Number(skjemaId)
                );
            } else {
                filteredAvvik = avvik.filter(
                    (a) => a.checklist.skjema.kontroll.id === Number(kontrollId)
                );
            }

            if (!showAll) {
                setAvvik(filteredAvvik.filter((a) => a.status !== 'lukket'));
            } else {
                setAvvik(filteredAvvik);
            }
        }
    }, [avvik, checklistId, kontrollId, showAll, skjemaId]);

    const askToDeleteAvvik = async (avvikId: number) => {
        const isConfirmed = await confirm(`Slette avvikID: ${avvikId}?`);

        if (isConfirmed) {
            deleteAvvik(avvikId);
        }
    };

    const close = async (avvikId: number) => {
        const avvikToClose = avvik?.find((a) => a.id === avvikId);
        if (avvikToClose !== undefined) {
            setSelected([avvikToClose]);
            setModalOpen(Modals.comment);
        }
    };

    const changeViewMode = () => {
        localStorage.setItem(
            StorageKeys.avvikViewMode,
            JSON.stringify(!showTable)
        );
        setShowTable(!showTable);
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
            const response = await getAvvikReport(
                Number(kontrollId),
                selected.map((sa) => sa.id)
            );

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

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
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
                                            action: () => changeViewMode()
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
                                            icon: <BuildIcon />,
                                            action: downloadAvvikList
                                        }
                                    ]}
                                />
                            }>
                            {skjemaer !== undefined ? (
                                <TableContainer
                                    columns={columns(
                                        kontroller ?? [],
                                        skjemaer ?? [],
                                        url,
                                        askToDeleteAvvik,
                                        setEditId,
                                        openAvvik,
                                        close
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="avvik">
                                    {showTable ? (
                                        <AvvikTable
                                            skjemaer={skjemaer}
                                            kontroller={kontroller ?? []}
                                            avvik={_avvik ?? []}
                                            selected={selected}
                                            onSelected={(avvik) => {
                                                setSelected(avvik);
                                                setSelectedFromGrid(false);
                                            }}
                                            selectedFromGrid={selectedFromGrid}
                                        />
                                    ) : (
                                        <AvvikGrid
                                            deleteAvvik={askToDeleteAvvik}
                                            edit={setEditId}
                                            open={openAvvik}
                                            close={close}
                                            avvik={_avvik ?? []}
                                            selected={selected}
                                            setSelected={(a) => {
                                                setSelected(a);
                                                setSelectedFromGrid(true);
                                            }}
                                            selectedFromGrid={selectedFromGrid}
                                            url={url}
                                        />
                                    )}
                                </TableContainer>
                            ) : (
                                <div>Laster avvik</div>
                            )}
                        </Card>
                    </Grid>
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
            />
            <AvvikCommentModal
                open={modalOpen === Modals.comment}
                close={() => setModalOpen(undefined)}
                selectedAvvik={selected}
            />
        </>
    );
};

export default AvvikView;
