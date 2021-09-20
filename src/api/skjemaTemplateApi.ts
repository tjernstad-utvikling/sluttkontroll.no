import {
    SkjemaTemplateCheckpoint,
    Template
} from '../contracts/skjemaTemplateApi';

import sluttkontrollApi from './sluttkontroll';

export const getTemplates = async (): Promise<{
    status: number;
    templates: Template[];
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/template/');
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
};

export const addTemplate = async (
    name: string,
    checkpointIds: number[]
): Promise<{
    status: number;
    template?: Template;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post('/template/', {
            name,
            checkpointIds
        });
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        console.error(error);
        throw new Error('');
    }
};

export const updateTemplate = async (
    templateId: number,
    name: string,
    checkpointIds: number[]
): Promise<{
    status: number;
    skjemaTemplateCheckpoints?: SkjemaTemplateCheckpoint[];
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.put(
            `/template/${templateId}`,
            {
                name,
                checkpointIds
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
        console.error(error);
        throw new Error('');
    }
};

export const deleteTemplate = async (
    templateId: number
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.delete(
            `/template/${templateId}`
        );

        return { status, ...data };
    } catch (error: any) {
        console.error(error);
        throw new Error('');
    }
};
