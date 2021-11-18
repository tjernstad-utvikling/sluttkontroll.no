import { ActionType, ContextInterface, PasteOptions } from './contracts';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { initialState, reducer } from './reducer';

import ContentCutIcon from '@mui/icons-material/ContentCut';
import Fab from '@mui/material/Fab';
import { Skjema } from '../../contracts/kontrollApi';
import { Theme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from '../../theme/makeStyles';
import { useKontroll } from '../kontroll';

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

    const { moveSkjema } = useKontroll();

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
    }

    function handlePaste({ skjemaPaste }: PasteOptions) {
        if (skjemaPaste !== undefined) {
            for (const skjema of skjemaPaste.skjema) {
                moveSkjema(skjema, skjemaPaste.kontrollId);
            }
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
