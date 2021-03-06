import { OutputData } from '@editorjs/editorjs';
import { ReportSetting } from '../contracts/reportApi';
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

export const getReportSetting = async (
    kontrollId: number
): Promise<{
    status: number;
    rapportSetting?: ReportSetting;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/report/setting/${kontrollId}`
        );
        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        return { status: 500 };
    }
};

export const updateReportSetting = async (
    setting: ReportSetting,
    kontrollId: number
): Promise<{
    status: number;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/report/setting/${kontrollId}`,
            setting
        );

        return { status, ...data };
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        return { status: error.response.status };
    }
};
