import { Template } from '../contracts/skjemaTemplateApi';
import sluttkontrollApi from './sluttkontroll';

export const getTemplates = async (): Promise<{
    status: number;
    templates: Template;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/v3/template/');
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        console.error(error);
        throw new Error('');
    }
};
