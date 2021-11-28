import { OutputData } from '@editorjs/editorjs';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';
export const getInfoText = async (): Promise<{
    status: number;
    infoText?: OutputData | undefined;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            '/settings/get-info-text'
        );
        if (status === 200) {
            return {
                status,
                infoText: data.infoText ? JSON.parse(data.infoText) : undefined
            };
        }
        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        return { status: 500 };
    }
};
export const setInfoText = async (
    infoText: OutputData
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.put(
            '/settings/set-info-text',
            {
                infoText: JSON.stringify(infoText)
            }
        );

        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        return { status: 500, message: 'unknown error' };
    }
};
