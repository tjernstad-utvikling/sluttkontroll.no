import { AvvikTable, columns, defaultColumns } from '../tables/avvik';
import { Card, CardMenu } from '../components/card';
import { useEffect, useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import { Avvik } from '../contracts/avvikApi';
import { AvvikCommentModal } from '../modal/avvikComment';
import { AvvikEditModal } from '../modal/avvik';
import { AvvikGrid } from '../components/avvik';
import { AvvikUtbedrereModal } from '../modal/avvikUtbedrere';
import { AvvikViewParams } from '../contracts/navigation';
import BuildIcon from '@material-ui/icons/Build';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import ReorderIcon from '@material-ui/icons/Reorder';
import { StorageKeys } from '../contracts/keys';
import { TableContainer } from '../tables/tableContainer';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import { useAvvik } from '../data/avvik';
import { useConfirm } from '../hooks/useConfirm';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';

const AvvikView = () => {
    const classes = usePageStyles();
    const { kontrollId, skjemaId, checklistId } = useParams<AvvikViewParams>();

    const [_avvik, setAvvik] = useState<Array<Avvik>>([]);
    const [selected, setSelected] = useState<Avvik[]>([]);
    const [selectedFromGrid, setSelectedFromGrid] = useState<boolean>(false);

    const [showTable, setShowTable] = useState<boolean>(false);

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
            if (checklistId !== undefined) {
                setAvvik(
                    avvik.filter((a) => a.checklist.id === Number(checklistId))
                );
            } else if (skjemaId !== undefined) {
                setAvvik(
                    avvik.filter(
                        (a) => a.checklist.skjema.id === Number(skjemaId)
                    )
                );
            } else {
                setAvvik(
                    avvik.filter(
                        (a) =>
                            a.checklist.skjema.kontroll.id ===
                            Number(kontrollId)
                    )
                );
            }
        }
    }, [avvik, checklistId, kontrollId, skjemaId]);

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
        localStorage.setItem(StorageKeys.avvikView, JSON.stringify(!showTable));
        setShowTable(!showTable);
    };

    useEffectOnce(() => {
        const jsonShowTable = localStorage.getItem(StorageKeys.avvikView);
        if (jsonShowTable !== null) {
            setShowTable(JSON.parse(jsonShowTable));
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
                                            action: () => console.log('new')
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
                                        }
                                    ]}
                                />
                            }>
                            {skjemaer !== undefined ? (
                                <TableContainer
                                    columns={columns(
                                        kontroller ?? [],
                                        skjemaer ?? [],
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
