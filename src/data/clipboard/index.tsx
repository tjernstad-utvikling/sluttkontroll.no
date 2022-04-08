import { ActionType, ContextInterface, PasteOptions } from './contracts';
import { Kontroll, Skjema } from '../../contracts/kontrollApi';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { initialState, reducer } from './reducer';

import { Avvik } from '../../contracts/avvikApi';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import Fab from '@mui/material/Fab';
import { Measurement } from '../../contracts/measurementApi';
import { Theme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from '../../theme/makeStyles';
import { useMoveAvvik } from '../../api/hooks/useAvvik';
import { useMoveKontroll } from '../../api/hooks/useKontroll';
import { useMoveMeasurement } from '../../api/hooks/useMeasurement';
import { useMoveSkjema } from '../../api/hooks/useSkjema';
import { useSnackbar } from 'notistack';

export const useClipBoard = () => {
    return useContext(ClipBoardContext);
};

const ClipBoardContext = createContext<ContextInterface>(
    {} as ContextInterface
);

export const ClipBoardContextProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const [showScissor, setShowScissor] = useState<boolean>(false);
    const [cutoutLength, setCutoutLength] = useState<number>(0);

    const moveMutation = useMoveKontroll();
    const moveSkjemaMutation = useMoveSkjema();
    const moveAvvikMutation = useMoveAvvik();
    const moveMeasurementMutation = useMoveMeasurement();

    const { classes } = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    function selectedSkjemaer(skjemaer: Skjema[]) {
        setCutoutLength(skjemaer.length);
        dispatch({
            type: ActionType.setSelectedSkjemaer,
            payload: skjemaer
        });
    }
    function setSkjemaerToPaste(skjemaer: Skjema[]) {
        dispatch({
            type: ActionType.setSkjemaToPast,
            payload: skjemaer
        });
    }

    function selectedMeasurements(measurements: Measurement[]) {
        setCutoutLength(measurements.length);
        dispatch({
            type: ActionType.setSelectedMeasurements,
            payload: measurements
        });
    }
    function setMeasurementToPaste(measurements: Measurement[]) {
        dispatch({
            type: ActionType.setMeasurementToPast,
            payload: measurements
        });
    }
    function selectedAvvik(avvik: Avvik[]) {
        setCutoutLength(avvik.length);
        dispatch({
            type: ActionType.setSelectedAvvik,
            payload: avvik
        });
    }
    function setAvvikToPaste(avvik: Avvik[]) {
        dispatch({
            type: ActionType.setAvvikToPaste,
            payload: avvik
        });
    }
    function selectedKontroll(kontroll: Kontroll[]) {
        setCutoutLength(kontroll.length);
        dispatch({
            type: ActionType.setSelectedKontroll,
            payload: kontroll
        });
    }
    function setKontrollToPaste(kontroll: Kontroll[]) {
        dispatch({
            type: ActionType.setKontrollToPaste,
            payload: kontroll
        });
    }

    function closeScissors() {
        setCutoutLength(0);
        setShowScissor(false);
        dispatch({
            type: ActionType.setSelectedSkjemaer,
            payload: []
        });
    }

    function handleCut() {
        if (state.skjemaer) {
            dispatch({
                type: ActionType.setSkjemaClipboard,
                payload: state.skjemaer
            });
        }
        if (state.measurements) {
            dispatch({
                type: ActionType.setMeasurementClipboard,
                payload: state.measurements
            });
        }
        if (state.avvik) {
            if (state.avvik.filter((a) => a.status === 'lukket').length > 0) {
                enqueueSnackbar('Kan ikke flytte avvik som er lukket', {
                    variant: 'warning'
                });
            }
            dispatch({
                type: ActionType.setAvvikClipboard,
                payload: state.avvik.filter((a) => a.status !== 'lukket')
            });
        }
        if (state.kontroll) {
            dispatch({
                type: ActionType.setKontrollClipboard,
                payload: state.kontroll
            });
        }
    }

    async function handlePaste({
        skjemaPaste,
        measurementPaste,
        avvikPaste,
        kontrollPaste
    }: PasteOptions) {
        if (skjemaPaste !== undefined) {
            for (const skjema of skjemaPaste.skjema) {
                try {
                    await moveSkjemaMutation.mutateAsync({
                        skjema,
                        kontrollId: skjemaPaste.kontrollId
                    });
                } catch (error) {
                    console.error(error);
                } finally {
                    dispatch({
                        type: ActionType.removeSkjemaClipboard,
                        payload: skjema
                    });
                }
            }
            dispatch({
                type: ActionType.setSkjemaToPast,
                payload: []
            });
        }
        if (measurementPaste !== undefined) {
            for (const measurement of measurementPaste.measurement) {
                try {
                    await moveMeasurementMutation.mutateAsync({
                        measurement,
                        skjemaId: measurementPaste.skjemaId
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    dispatch({
                        type: ActionType.removeMeasurementClipboard,
                        payload: measurement
                    });
                }
            }
            dispatch({
                type: ActionType.setMeasurementToPast,
                payload: []
            });
        }
        if (avvikPaste !== undefined) {
            for (const avvik of avvikPaste.avvik) {
                try {
                    await moveAvvikMutation.mutateAsync({
                        avvik,
                        checklistId: avvikPaste.checklistId
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    dispatch({
                        type: ActionType.removeAvvikClipboard,
                        payload: avvik
                    });
                }
            }
            dispatch({
                type: ActionType.setAvvikToPaste,
                payload: []
            });
        }

        if (kontrollPaste !== undefined) {
            for (const kontroll of kontrollPaste.kontroll) {
                try {
                    await moveMutation.mutateAsync({
                        kontroll,
                        klientId: kontrollPaste.klientId,
                        locationId: kontrollPaste.locationId
                    });
                } catch (error) {
                    console.error(error);
                } finally {
                    dispatch({
                        type: ActionType.removeKontrollClipboard,
                        payload: kontroll
                    });
                }
            }
            dispatch({
                type: ActionType.setKontrollToPaste,
                payload: []
            });
        }
    }

    return (
        <ClipBoardContext.Provider
            value={{
                state,

                openScissors: () => setShowScissor(true),
                closeScissors,

                selectedSkjemaer,
                setSkjemaerToPaste,
                clipboardHasSkjema:
                    (state.skjemaClipboard &&
                        state.skjemaClipboard?.length > 0) ||
                    false,

                selectedMeasurements,
                setMeasurementToPaste,
                clipboardHasMeasurement:
                    (state.measurementClipboard &&
                        state.measurementClipboard?.length > 0) ||
                    false,

                selectedAvvik,
                setAvvikToPaste,
                clipboardHasAvvik:
                    (state.avvikClipboard &&
                        state.avvikClipboard?.length > 0) ||
                    false,
                selectedKontroll,
                setKontrollToPaste,
                clipboardHasKontroll:
                    (state.kontrollClipboard &&
                        state.kontrollClipboard?.length > 0) ||
                    false,

                handlePaste
            }}>
            {children}
            {showScissor && (
                <Tooltip title="Klipp ut valgte">
                    <Fab
                        color="primary"
                        aria-label={`Klipp ut valgte, ${cutoutLength} stykk`}
                        className={classes.fab}
                        onClick={handleCut}>
                        <ContentCutIcon />
                        {cutoutLength > 0 && ` (${cutoutLength})`}
                    </Fab>
                </Tooltip>
            )}
        </ClipBoardContext.Provider>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    }
}));
