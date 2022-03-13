import { AvvikTable, columns, defaultColumns } from '../tables/avvik';
import { Card, CardContent, CardMenu } from '../components/card';

import { AvvikGrid } from '../components/avvik';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/tableContainer';
import Typography from '@mui/material/Typography';
import { useAssignedAvvik } from '../api/hooks/useAvvik';
import { useKontrollerByIds } from '../api/hooks/useKontroll';
import { useMemo } from 'react';
import { usePageStyles } from '../styles/kontroll/page';

const ExternalDashboardView = () => {
    const { classes } = usePageStyles();

    const assignedAvvik = useAssignedAvvik();

    const kontrollIds = useMemo(() => {
        const ids = assignedAvvik?.data?.map(
            (a) => a.checklist.skjema.kontroll.id
        );
        return ids?.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }, [assignedAvvik.data]);

    const kontroller = useKontrollerByIds(kontrollIds ?? []);

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Dine avvik" menu={<CardMenu items={[]} />}>
                            <CardContent>
                                {!assignedAvvik.isLoading ? (
                                    <TableContainer
                                        columns={columns({
                                            kontroller: [],
                                            skjemaer: [],
                                            url: ''
                                        })}
                                        defaultColumns={defaultColumns}
                                        tableId="avvik">
                                        {true ? (
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
                                                url={''}
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
