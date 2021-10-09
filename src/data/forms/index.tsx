import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { initialState, reducer } from './reducer';

import { errorHandler } from '../../tools/errorHandler';
import { useSnackbar } from 'notistack';

export const useForms = () => {
    return useContext(Context);
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const FormsContextProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [hasLoadedTemplates, setHasLoadedTemplates] =
        useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    const loadTemplates = async (): Promise<void> => {
        if (!hasLoadedTemplates) {
            try {
            } catch (error: any) {
                errorHandler(error);
            }
            setHasLoadedTemplates(true);
        }
    };

    return (
        <Context.Provider
            value={{
                state,

                loadTemplates
            }}>
            {children}
        </Context.Provider>
    );
};
