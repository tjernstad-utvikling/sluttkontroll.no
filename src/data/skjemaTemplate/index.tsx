import { ActionType, ContextInterface } from './contracts';
import React, { createContext, useContext, useReducer, useState } from 'react';
import {
    addTemplate,
    deleteTemplate,
    getTemplates,
    updateTemplate as updateTemplateApi
} from '../../api/skjemaTemplateApi';
import { initialState, reducer } from './reducer';

import { Checkpoint } from '../../contracts/checkpointApi';
import { Template } from '../../contracts/skjemaTemplateApi';
import { errorHandler } from '../../tools/errorHandler';
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
                errorHandler(error);
            }
            setHasLoadedTemplates(true);
        }
    };

    const newTemplate = async (
        name: string,
        checkpoints: Checkpoint[]
    ): Promise<boolean> => {
        try {
            const { status, template, message } = await addTemplate(
                name,
                checkpoints.map((c) => c.id)
            );
            if (status === 200 && template !== undefined) {
                dispatch({
                    type: ActionType.addTemplates,
                    payload: [template]
                });

                enqueueSnackbar('Sjekklistemal lagret', {
                    variant: 'success'
                });
                return true;
            }
            if (status === 400 && message === 'name_missing') {
                enqueueSnackbar('Navn mangler', {
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
        }
        return false;
    };

    const updateTemplate = async (
        _template: Template,
        selectedCheckpoints: Checkpoint[]
    ): Promise<boolean> => {
        try {
            const { status, skjemaTemplateCheckpoints, message } =
                await updateTemplateApi(
                    _template.id,
                    _template.name,
                    selectedCheckpoints.map((sc) => sc.id)
                );
            if (status === 200 && skjemaTemplateCheckpoints !== undefined) {
                dispatch({
                    type: ActionType.updateTemplate,
                    payload: { ..._template, skjemaTemplateCheckpoints }
                });

                enqueueSnackbar('Sjekklistemal lagret', {
                    variant: 'success'
                });
                return true;
            }
            if (status === 400 && message === 'name_missing') {
                enqueueSnackbar('Navn mangler', {
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
        }
        return false;
    };
    const removeTemplate = async (template: Template): Promise<boolean> => {
        try {
            const { status } = await deleteTemplate(template.id);
            if (status === 204) {
                dispatch({
                    type: ActionType.removeTemplate,
                    payload: template
                });

                enqueueSnackbar('Sjekklistemal slettet', {
                    variant: 'success'
                });
                return true;
            }

            enqueueSnackbar('Ukjent feil ved sletting av mal', {
                variant: 'warning'
            });
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med sletting av mal', {
                variant: 'error'
            });
        }
        return false;
    };

    return (
        <TemplateContext.Provider
            value={{
                state,

                loadTemplates,
                newTemplate,
                updateTemplate,
                removeTemplate
            }}>
            {children}
        </TemplateContext.Provider>
    );
};
