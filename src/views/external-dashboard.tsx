import { AvvikTable, columns, defaultColumns } from '../tables/avvik';
import { Card, CardContent, CardMenu } from '../components/card';
import { useAssignedAvvik, useCloseAvvik } from '../api/hooks/useAvvik';

import { AvvikCommentModal } from '../modal/avvikComment';
import { AvvikGrid } from '../components/avvik';
import BuildIcon from '@mui/icons-material/Build';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ReorderIcon from '@mui/icons-material/Reorder';
import { StorageKeys } from '../contracts/keys';
import { TableContainer } from '../tables/tableContainer';
import Typography from '@mui/material/Typography';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useExternalKontroller } from '../api/hooks/useKontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useRouteMatch } from 'react-router-dom';
import { useState } from 'react';

enum Modals {
    utbedrer,
    comment
}

const ExternalDashboardView = () => {
    const { classes } = usePageStyles();
    const [showTable, setShowTable] = useState<boolean>(false);

    const [modalOpen, setModalOpen] = useState<Modals>();

    const { url } = useRouteMatch();

    const assignedAvvik = useAssignedAvvik();
    const [selected, setSelected] = useState<number[]>([]);
    const [selectedFromGrid, setSelectedFromGrid] = useState<boolean>(false);

    const externalKontrollData = useExternalKontroller();
    const changeViewMode = () => {
        localStorage.setItem(
            StorageKeys.avvikViewMode,
            JSON.stringify(!showTable)
        );
        setShowTable(!showTable);
    };
    useEffectOnce(() => {
        const jsonShowTable = localStorage.getItem(StorageKeys.avvikViewMode);
        if (jsonShowTable !== null) {
            setShowTable(JSON.parse(jsonShowTable));
        }
    });
    const closeMutation = useCloseAvvik();

    async function closeAvvik(avvikList: number[], kommentar: string) {
        await closeMutation.mutateAsync({
            avvikList,
            kommentar
        });
        if (closeMutation.isSuccess) return true;

        return false;
    }

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Dine avvik"
                            menu={
                                <CardMenu
                                    count={selected.length}
                                    items={[
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
                                            label: `Lukk valgte avvik (${selected.length})`,
                                            icon: <BuildIcon />,
                                            action: () =>
                                                setModalOpen(Modals.comment)
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                {!assignedAvvik.isLoading ? (
                                    <TableContainer
                                        columns={columns({
                                            kontroller:
                                                externalKontrollData.data
                                                    ?.kontroller ?? [],
                                            skjemaer:
                                                externalKontrollData.data
                                                    ?.skjemaer ?? [],
                                            url: `${url}/avvik`
                                        })}
                                        defaultColumns={defaultColumns}
                                        tableId="avvik">
                                        {showTable ? (
                                            <AvvikTable
                                                avvik={assignedAvvik.data ?? []}
                                                selected={selected}
                                                onSelected={(avvik) => {
                                                    setSelected(avvik);
                                                    setSelectedFromGrid(false);
                                                }}
                                            />
                                        ) : (
                                            <AvvikGrid
                                                close={(a) => console.log(a)}
                                                avvik={assignedAvvik.data ?? []}
                                                selected={selected}
                                                setSelected={(a) => {
                                                    setSelected(a);
                                                    setSelectedFromGrid(true);
                                                }}
                                                selectedFromGrid={
                                                    selectedFromGrid
                                                }
                                                url={`${url}/avvik`}
                                            />
                                        )}
                                    </TableContainer>
                                ) : (
                                    <Typography>Laster avvik</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <AvvikCommentModal
                open={modalOpen === Modals.comment}
                close={() => setModalOpen(undefined)}
                selectedAvvik={selected}
                closeAvvik={closeAvvik}
            />
        </>
    );
};

export default ExternalDashboardView;
