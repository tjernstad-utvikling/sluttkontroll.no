import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer, useState } from 'react';
import { initialState, reducer } from './reducer';

import { FormsTemplate } from '../../contracts/sjaApi';
import { addTemplate } from '../../api/formsTemplateApi';
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

    const { enqueueSnackbar } = useSnackbar();

    const newTemplate = async (
        title: string,
        subTitle: string,
        description: string
    ): Promise<FormsTemplate | false> => {
        try {
            const { status, template, message } = await addTemplate(
                title,
                subTitle,
                description
            );
            if (status === 200 && template !== undefined) {
                dispatch({
                    type: ActionType.addTemplates,
                    payload: [template]
                });

                enqueueSnackbar('Mal lagret', {
                    variant: 'success'
                });
                return template;
            }
            if (status === 400) {
                enqueueSnackbar('Tittel eller under tittel mangler', {
                    variant: 'warning'
                });
                return false;
            }

            enqueueSnackbar('Ukjent feil ved lagring av mal', {
                variant: 'warning'
            });
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av mal', {
                variant: 'error'
            });
            errorHandler(error);
        }
        return false;
    };

    return (
        <Context.Provider
            value={{
                state,

                newTemplate
            }}>
            {children}
        </Context.Provider>
    );
};
