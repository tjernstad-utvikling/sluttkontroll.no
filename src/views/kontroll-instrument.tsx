import { Card, CardContent, CardMenu } from '../components/card';
import {
    useInstruments,
    useRemoveInstrumentDisponent,
    useSetInstrumentDisponent
} from '../api/hooks/useInstrument';
import {
    useKontrollById,
    useUpdateKontrollRemoveInstrumentConnection
} from '../api/hooks/useKontroll';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { InstrumentCalibrationModal } from '../modal/instrumentCalibration';
import { InstrumentModal } from '../modal/instrument';
import { InstrumentSelectModal } from '../modal/instrumentSelect';
import { InstrumentTable } from '../tables/instrument';
import { KontrollInstrumentViewParams } from '../contracts/navigation';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import { useCurrentUser } from '../api/hooks/useUsers';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const KontrollInstrumentsView = () => {
    const { classes } = usePageStyles();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
    const [calibrationModalId, setCalibrationModalId] = useState<number>();
    const [editId, setEditId] = useState<number>();

    const { kontrollId } = useParams<KontrollInstrumentViewParams>();

    const currentUserData = useCurrentUser();

    const instrumentsData = useInstruments({ kontrollId: Number(kontrollId) });

    const kontrollData = useKontrollById(Number(kontrollId));

    const instrumentDisponentMutation = useSetInstrumentDisponent();
    const removeInstrumentDisponentMutation = useRemoveInstrumentDisponent();

    const removeInstrumentConnectionMutation =
        useUpdateKontrollRemoveInstrumentConnection();

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

    async function removeInstrument(instrumentId: number) {
        await removeInstrumentConnectionMutation.mutateAsync({
            kontrollId: Number(kontrollId),
            instrumentId
        });
    }

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Instrumenter tilknyttet kontroll"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Legg til instrument',
                                            action: () =>
                                                setIsSelectModalOpen(true)
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
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
                                    customRowAction={(instrumentId) =>
                                        kontrollData.data?.done ? undefined : (
                                            <IconButton
                                                onClick={() =>
                                                    removeInstrument(
                                                        instrumentId
                                                    )
                                                }
                                                color="error"
                                                aria-label="fjern instrument fra liste">
                                                <PlaylistRemoveIcon />
                                            </IconButton>
                                        )
                                    }
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
            <InstrumentSelectModal
                kontrollId={Number(kontrollId)}
                open={isSelectModalOpen}
                close={() => {
                    setIsSelectModalOpen(!isSelectModalOpen);
                }}
            />
        </>
    );
};

export default KontrollInstrumentsView;
