import { Card, CardContent, CardMenu } from '../components/card';
import {
    useInstruments,
    useRemoveInstrumentDisponent,
    useSetInstrumentDisponent
} from '../api/hooks/useInstrument';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { InstrumentCalibrationModal } from '../modal/instrumentCalibration';
import { InstrumentModal } from '../modal/instrument';
import { InstrumentStatus } from '../components/instrument';
import { InstrumentTable } from '../tables/instrument';
import { useCurrentUser } from '../api/hooks/useUsers';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const InstrumentsView = () => {
    const { classes } = usePageStyles();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [calibrationModalId, setCalibrationModalId] = useState<number>();
    const [editId, setEditId] = useState<number>();

    const currentUserData = useCurrentUser();

    const instrumentsData = useInstruments({});

    const instrumentDisponentMutation = useSetInstrumentDisponent();
    const removeInstrumentDisponentMutation = useRemoveInstrumentDisponent();

    const handleInstrumentBooking = async (instrumentId: number) => {
        const instrument = instrumentsData.data?.find(
            (i) => i.id === instrumentId
        );
        if (currentUserData.data !== undefined && instrument !== undefined) {
            if (instrument.disponent?.id === currentUserData.data.id) {
                try {
                    await removeInstrumentDisponentMutation.mutateAsync({
                        instrumentId: instrument.id
                    });
                } catch (error) {
                    console.log(error);
                }
            } else {
                try {
                    await instrumentDisponentMutation.mutateAsync({
                        instrumentId: instrument.id,
                        userId: currentUserData.data.id
                    });
                } catch (error) {
                    console.log(error);
                }
            }
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

                                <InstrumentTable
                                    changeDisponent={handleInstrumentBooking}
                                    currentUser={currentUserData.data}
                                    edit={(id: number) => {
                                        setEditId(id);
                                        setIsModalOpen(true);
                                    }}
                                    regCalibration={(id: number) => {
                                        setCalibrationModalId(id);
                                    }}
                                    isLoading={instrumentsData.isLoading}
                                    instruments={instrumentsData.data ?? []}
                                />
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
