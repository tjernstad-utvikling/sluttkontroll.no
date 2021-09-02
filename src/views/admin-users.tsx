import { Card, CardMenu } from '../components/card';
import {
    InstrumentTable,
    defaultColumns,
    instrumentColumns
} from '../tables/instrument';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { TableContainer } from '../tables/tableContainer';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useInstrument } from '../data/instrument';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const UsersView = () => {
    const classes = usePageStyles();

    const { user } = useAuth();
    const {
        state: { instruments },
        loadInstruments,
        updateInstrumentDisponent
    } = useInstrument();

    useEffectOnce(() => {
        loadInstruments();
    });

    const handleInstrumentBooking = (instrumentId: number) => {
        const instrument = instruments?.find((i) => i.id === instrumentId);
        if (user !== undefined && instrument !== undefined) {
            updateInstrumentDisponent(instrument, user);
        }
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Instrumenter"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Nytt instrument',
                                            action: () => setIsModalOpen(true)
                                        }
                                    ]}
                                />
                            }>
                            {instruments !== undefined ? (
                                <TableContainer
                                    columns={instrumentColumns({
                                        edit: (id: number) => {
                                            setEditId(id);
                                            setIsModalOpen(true);
                                        },
                                        regCalibration: (id: number) => {
                                            setCalibrationModalId(id);
                                        },
                                        currentUser: user,
                                        changeDisponent: handleInstrumentBooking
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="instruments">
                                    <InstrumentTable
                                        instruments={instruments ?? []}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster brukere</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default UsersView;
