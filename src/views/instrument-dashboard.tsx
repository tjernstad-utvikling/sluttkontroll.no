import { Card, CardContent, CardMenu } from '../components/card';
import {
    InstrumentTable,
    defaultColumns,
    instrumentColumns
} from '../tables/instrument';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { InstrumentCalibrationModal } from '../modal/instrumentCalibration';
import { InstrumentModal } from '../modal/instrument';
import { InstrumentStatus } from '../components/instrument';
import { TableContainer } from '../tables/tableContainer';
import { useAuth } from '../hooks/useAuth';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useInstrument } from '../data/instrument';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const InstrumentsView = () => {
    const { classes } = usePageStyles();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [calibrationModalId, setCalibrationModalId] = useState<number>();
    const [editId, setEditId] = useState<number>();

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
                            <CardContent>
                                <InstrumentStatus />
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
                                            changeDisponent:
                                                handleInstrumentBooking
                                        })}
                                        defaultColumns={defaultColumns}
                                        tableId="instruments">
                                        <InstrumentTable
                                            instruments={instruments ?? []}
                                        />
                                    </TableContainer>
                                ) : (
                                    <div>Laster instrumenter</div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <InstrumentCalibrationModal
                close={() => setCalibrationModalId(undefined)}
                regId={calibrationModalId}
            />
            <InstrumentModal
                editId={editId}
                open={isModalOpen}
                close={() => {
                    setIsModalOpen(!isModalOpen);
                    setEditId(undefined);
                }}
            />
        </>
    );
};

export default InstrumentsView;
