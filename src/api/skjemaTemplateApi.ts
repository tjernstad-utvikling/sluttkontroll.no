import { Template } from '../contracts/skjemaTemplateApi';
import sluttkontrollApi from './sluttkontroll';

export const getTemplates = async (): Promise<{
    status: number;
    templates: Template[];
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/v3/template/');
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        console.error(error);
        throw new Error('');
    }
};
export const addTemplates = async (
    name: string,
    checkpointIds: number[]
): Promise<{
    status: number;
    templates: Template;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post('/v3/template/', {
            name,
            checkpointIds
        });
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        console.error(error);
        throw new Error('');
    }
};
