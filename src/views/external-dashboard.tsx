import { AvvikTable, columns, defaultColumns } from '../tables/avvik';
import { Card, CardContent, CardMenu } from '../components/card';

import { AvvikGrid } from '../components/avvik';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ReorderIcon from '@mui/icons-material/Reorder';
import { StorageKeys } from '../contracts/keys';
import { TableContainer } from '../tables/tableContainer';
import Typography from '@mui/material/Typography';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import { useAssignedAvvik } from '../api/hooks/useAvvik';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useExternalKontroller } from '../api/hooks/useKontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const ExternalDashboardView = () => {
    const { classes } = usePageStyles();
    const [showTable, setShowTable] = useState<boolean>(false);

    const assignedAvvik = useAssignedAvvik();

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
                                            url: '/external/avvik'
                                        })}
                                        defaultColumns={defaultColumns}
                                        tableId="avvik">
                                        {showTable ? (
                                            <AvvikTable
                                                avvik={assignedAvvik.data ?? []}
                                                selected={[]}
                                                onSelected={(avvik) => {
                                                    console.log(avvik);
                                                }}
                                            />
                                        ) : (
                                            <AvvikGrid
                                                close={(a) => console.log(a)}
                                                avvik={assignedAvvik.data ?? []}
                                                selected={[]}
                                                setSelected={(a) => {}}
                                                selectedFromGrid={true}
                                                url={'/external/avvik'}
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
        </>
    );
};

export default ExternalDashboardView;
