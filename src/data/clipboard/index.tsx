import { ActionType, ContextInterface, PasteOptions } from './contracts';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { initialState, reducer } from './reducer';

import { Avvik } from '../../contracts/avvikApi';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import Fab from '@mui/material/Fab';
import { Measurement } from '../../contracts/measurementApi';
import { Skjema } from '../../contracts/kontrollApi';
import { Theme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from '../../theme/makeStyles';
import { useAvvik } from '../avvik';
import { useKontroll } from '../kontroll';
import { useMeasurement } from '../measurement';
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

    const { classes } = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const {
        state: { skjemaer, checklists },
        moveSkjema
    } = useKontroll();
    const { moveMeasurement } = useMeasurement();
    const { moveAvvik } = useAvvik();

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

    function closeScissors() {
        setCutoutLength(0);
        setShowScissor(false);
        dispatch({
            type: ActionType.setSelectedSkjemaer,
            payload: []
        });
    }

    function handleCut() {
        console.log('handleCut', state);
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
    }

    async function handlePaste({
        skjemaPaste,
        measurementPaste,
        avvikPaste
    }: PasteOptions) {
        if (skjemaPaste !== undefined) {
            for (const skjema of skjemaPaste.skjema) {
                if (await moveSkjema(skjema, skjemaPaste.kontrollId)) {
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
                const skjema = skjemaer?.find(
                    (skjema) => skjema.id === measurementPaste.skjemaId
                );
                if (skjema) {
                    if (await moveMeasurement(measurement, skjema)) {
                        dispatch({
                            type: ActionType.removeMeasurementClipboard,
                            payload: measurement
                        });
                    }
                }
            }
            dispatch({
                type: ActionType.setMeasurementToPast,
                payload: []
            });
        }
        if (avvikPaste !== undefined) {
            for (const avvik of avvikPaste.avvik) {
                const checklist = checklists?.find(
                    (checklist) => checklist.id === avvikPaste.checklistId
                );
                const skjema = skjemaer?.find(
                    (skjema) => skjema.id === checklist?.skjema.id
                );
                if (checklist && skjema) {
                    if (await moveAvvik(avvik, checklist, skjema)) {
                        dispatch({
                            type: ActionType.removeAvvikClipboard,
                            payload: avvik
                        });
                    }
                }
            }
            dispatch({
                type: ActionType.setAvvikToPaste,
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
