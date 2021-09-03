import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { initialState, reducer } from './reducer';

import { getTemplates } from '../../api/skjemaTemplateApi';
import { useSnackbar } from 'notistack';

export const useTemplate = () => {
    return useContext(TemplateContext);
};

const TemplateContext = createContext<ContextInterface>({} as ContextInterface);

export const TemplateContextProvider = ({
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
                const { status, templates } = await getTemplates();

                if (status === 200) {
                    dispatch({
                        type: ActionType.addTemplates,
                        payload: templates
                    });
                }
            } catch (error: any) {
                console.log(error);
            }
            setHasLoadedTemplates(true);
        }
    };

    return (
        <TemplateContext.Provider
            value={{
                state,

                loadTemplates
            }}>
            {children}
        </TemplateContext.Provider>
    );
};
