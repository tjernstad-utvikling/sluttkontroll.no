import { ActionType, ContextInterface } from './contracts';
import {
    FormsField,
    FormsFieldTypeEnum,
    FormsGroup,
    FormsObjectChoice,
    FormsTemplate
} from '../../contracts/sjaApi';
import React, { createContext, useContext, useReducer } from 'react';
import {
    addTemplate,
    addTemplateField,
    addTemplateGroup,
    setListIdentification,
    sortTemplateField,
    sortTemplateGroup,
    updateTemplate,
    updateTemplateField,
    updateTemplateGroup
} from '../../api/formsTemplateApi';
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

    const { enqueueSnackbar } = useSnackbar();

    const newTemplate = async (
        title: string,
        subTitle: string,
        description: string
    ): Promise<FormsTemplate | false> => {
        try {
            const { status, template } = await addTemplate(
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

    const editTemplate = async (
        template: FormsTemplate
    ): Promise<FormsTemplate | false> => {
        try {
            console.log('before updateTemplate', { template });
            const { status } = await updateTemplate(template);
            console.log('after updateTemplate', { status });
            if (status === 204) {
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

    const setIdentification = async (
        template: FormsTemplate,
        fieldId: number
    ): Promise<FormsTemplate | false> => {
        try {
            const { status } = await setListIdentification(
                template.id,
                fieldId
            );

            if (status === 204) {
                console.log('updateTemplate', {
                    ...template,
                    listIdentificationField: { id: fieldId }
                });
                dispatch({
                    type: ActionType.addTemplates,
                    payload: [
                        {
                            ...template,
                            listIdentificationField: { id: fieldId }
                        }
                    ]
                });

                enqueueSnackbar('Mal lagret', {
                    variant: 'success'
                });
                return {
                    ...template,
                    listIdentificationField: { id: fieldId }
                };
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

    const newTemplateGroup = async (
        title: string,
        description: string,
        templateId: number
    ): Promise<boolean> => {
        try {
            const { status, group } = await addTemplateGroup(
                title,
                description,
                templateId
            );
            if (status === 200 && group !== undefined) {
                dispatch({
                    type: ActionType.addGroups,
                    payload: [group]
                });

                enqueueSnackbar('Gruppe lagret', {
                    variant: 'success'
                });
                return true;
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

    const editTemplateGroup = async (group: FormsGroup): Promise<boolean> => {
        try {
            const { status } = await updateTemplateGroup(group);
            if (status === 204) {
                dispatch({
                    type: ActionType.addGroups,
                    payload: [group]
                });

                enqueueSnackbar('Gruppe lagret', {
                    variant: 'success'
                });
                return true;
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

    const sortGroup = async (
        _groups: FormsGroup[],
        startIndex: number,
        endIndex: number
    ): Promise<boolean> => {
        try {
            const [removed] = _groups.splice(startIndex, 1);
            _groups.splice(endIndex, 0, removed);

            const sortedGroupsList = _groups.map((group, i) => {
                return { id: group.id, index: i };
            });

            const sortedGroups = _groups.map((g, i) => {
                return { ...g, sortingIndex: i };
            });

            dispatch({
                type: ActionType.addGroups,
                payload: sortedGroups
            });

            const { status, groups } = await sortTemplateGroup(
                sortedGroupsList
            );
            if (status === 200 && groups !== undefined) {
                return true;
            }
            if (status === 400) {
                enqueueSnackbar('Sorterte grupper mangler', {
                    variant: 'warning'
                });
                return false;
            }

            enqueueSnackbar('Ukjent feil ved lagring av sortering', {
                variant: 'warning'
            });
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av sortering', {
                variant: 'error'
            });
            errorHandler(error);
        }
        return false;
    };

    const newTemplateField = async (
        title: string,
        type: FormsFieldTypeEnum,
        textChoices: string[] | undefined,
        objectChoices: FormsObjectChoice[] | undefined,
        objectTitle: string | undefined,
        sortingIndex: number,
        groupId: number
    ): Promise<boolean> => {
        try {
            const { status, field } = await addTemplateField(
                title,
                type,
                textChoices,
                objectChoices,
                objectTitle,
                sortingIndex,
                groupId
            );
            console.log({ ...field });
            if (status === 200 && field !== undefined) {
                dispatch({
                    type: ActionType.addFields,
                    payload: [field]
                });

                enqueueSnackbar('Felt lagret', {
                    variant: 'success'
                });
                return true;
            }
            if (status === 400) {
                enqueueSnackbar('Tittel eller type mangler', {
                    variant: 'warning'
                });
                return false;
            }

            enqueueSnackbar('Ukjent feil ved lagring av felt', {
                variant: 'warning'
            });
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av felt', {
                variant: 'error'
            });
            errorHandler(error);
        }
        return false;
    };

    const editTemplateField = async (
        updateField: FormsField
    ): Promise<boolean> => {
        try {
            const { status, field } = await updateTemplateField(updateField);
            console.log('editTemplateField', { field });
            if (status === 200 && field !== undefined) {
                dispatch({
                    type: ActionType.addFields,
                    payload: [field]
                });

                enqueueSnackbar('Felt lagret', {
                    variant: 'success'
                });
                return true;
            }
            if (status === 400) {
                enqueueSnackbar('Tittel eller type mangler', {
                    variant: 'warning'
                });
                return false;
            }

            enqueueSnackbar('Ukjent feil ved lagring av felt', {
                variant: 'warning'
            });
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av felt', {
                variant: 'error'
            });
            errorHandler(error);
        }
        return false;
    };

    const sortFields = async (
        _fields: FormsField[],
        startIndex: number,
        endIndex: number
    ): Promise<boolean> => {
        try {
            const [removed] = _fields.splice(startIndex, 1);
            _fields.splice(endIndex, 0, removed);

            const sortedFieldsList = _fields.map((group, i) => {
                return { id: group.id, index: i };
            });

            const sortedFields = _fields.map((g, i) => {
                return { ...g, sortingIndex: i };
            });

            dispatch({
                type: ActionType.addFields,
                payload: sortedFields
            });

            const { status, fields } = await sortTemplateField(
                sortedFieldsList
            );
            if (status === 200 && fields !== undefined) {
                return true;
            }
            if (status === 400) {
                enqueueSnackbar('Sorterte felter mangler', {
                    variant: 'warning'
                });
                return false;
            }

            enqueueSnackbar('Ukjent feil ved lagring av sortering', {
                variant: 'warning'
            });
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av sortering', {
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

                newTemplate,
                editTemplate,
                setIdentification,
                newTemplateGroup,
                editTemplateGroup,
                sortGroup,
                newTemplateField,
                editTemplateField,
                sortFields
            }}>
            {children}
        </Context.Provider>
    );
};
