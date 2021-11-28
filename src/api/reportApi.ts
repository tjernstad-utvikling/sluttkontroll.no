import { OutputData } from '@editorjs/editorjs';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const getReportStatement = async (
    kontrollId: number
): Promise<{
    status: number;
    rapportStatement?: OutputData | undefined;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/report/statement/${kontrollId}`
        );

        if (status === 200) {
            return {
                status,
                rapportStatement: data.rapportStatement
                    ? JSON.parse(data.rapportStatement)
                    : undefined
            };
        }
        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        return { status: 500 };
    }
};
export const updateReportStatement = async (
    statement: OutputData,
    kontrollId: number
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/report/statement/${kontrollId}`,
            {
                statement: JSON.stringify(statement)
            }
        );

        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        return { status: 500 };
    }
};
