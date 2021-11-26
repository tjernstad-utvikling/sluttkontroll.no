import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const getReportStatement = async (
    kontrollId: number
): Promise<{
    status: number;
    rapportStatement?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/report/statement/${kontrollId}`
        );

        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        return { status: 500 };
    }
};
export const updateReportStatement = async (
    statement: string,
    kontrollId: number
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/report/statement/${kontrollId}`,
            {
                statement
            }
        );

        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        return { status: 500 };
    }
};
