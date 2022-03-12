import { AvvikTable, columns, defaultColumns } from '../tables/avvik';
import { Card, CardContent, CardMenu } from '../components/card';

import { AvvikGrid } from '../components/avvik';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/tableContainer';
import { getAssignedAvvik } from '../api/avvikApi';
import { usePageStyles } from '../styles/kontroll/page';
import { useQuery } from 'react-query';

const ExternalDashboardView = () => {
    const { classes } = usePageStyles();

    const { isLoading, error, data, isFetching } = useQuery(
        'assignedAvvik',
        async () => {
            const { avvik } = await getAssignedAvvik();
            return avvik;
        }
    );

    if (isLoading) return <p>Loading...</p>;
    console.table(data);

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Dine avvik" menu={<CardMenu items={[]} />}>
                            <CardContent>
                                <TableContainer
                                    columns={columns({
                                        kontroller: [],
                                        skjemaer: [],
                                        url: ''
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="avvik">
                                    {false ? (
                                        <AvvikTable
                                            avvik={[]}
                                            selected={[]}
                                            onSelected={(avvik) => {
                                                console.log(avvik);
                                            }}
                                        />
                                    ) : (
                                        <AvvikGrid
                                            close={(a) => console.log(a)}
                                            avvik={[]}
                                            selected={[]}
                                            setSelected={(a) => {}}
                                            selectedFromGrid={true}
                                            url={''}
                                        />
                                    )}
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default ExternalDashboardView;
