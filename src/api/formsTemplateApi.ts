import {
    FormsField,
    FormsFieldTypeEnum,
    FormsGroup,
    FormsObjectChoice,
    FormsTemplate
} from '../contracts/sjaApi';

import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const addTemplate = async (
    title: string,
    subTitle: string,
    description: string
): Promise<{
    status: number;
    template?: FormsTemplate;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            '/forms/template/',
            {
                title,
                subTitle,
                description
            }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw error;
    }
};
export const updateTemplate = async (
    template: FormsTemplate
): Promise<{
    status: number;
    message?: string;
}> => {
    console.log('updateTemplateApi Befor put');
    try {
        const { status, data } = await sluttkontrollApi.put(
            `/forms/template/${template.id}`,
            {
                ...template
            }
        );
        console.log({ status });
        if (status === 204) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw error;
    }
};

export const addTemplateGroup = async (
    title: string,
    description: string,
    templateId: number
): Promise<{
    status: number;
    group?: FormsGroup;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/forms/template/group/${templateId}`,
            {
                title,
                description
            }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw error;
    }
};

export const updateTemplateGroup = async (
    group: FormsGroup
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.put(
            `/forms/template/group/${group.id}`,
            {
                ...group
            }
        );
        if (status === 204) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw error;
    }
};

export const sortTemplateGroup = async (
    sortedGroups: { id: number; index: number }[]
): Promise<{
    status: number;
    groups?: FormsGroup[];
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.put(
            `/forms/template/group/sort`,
            {
                sortedGroups
            }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw error;
    }
};

export const addTemplateField = async (
    title: string,
    type: FormsFieldTypeEnum,
    textChoices: string[] | undefined,
    objectChoices: FormsObjectChoice[] | undefined,
    objectTitle: string | undefined,
    sortingIndex: number,
    groupId: number
): Promise<{
    status: number;
    field?: FormsField;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/forms/template/field/${groupId}`,
            {
                title,
                type,
                textChoices,
                objectChoices,
                objectTitle,
                sortingIndex
            }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw error;
    }
};
