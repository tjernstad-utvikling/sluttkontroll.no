import { Attachment } from '../contracts/attachmentApi';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const uploadAttachment = async (
    kontrollId: number,
    attachment: File,
    name: string,
    description: string
): Promise<{ status: number; attachment?: Attachment; message?: string }> => {
    try {
        const formData = new FormData();

        formData.append('attachment', attachment);
        formData.append('data', JSON.stringify({ name, description }));

        const { status, data } = await sluttkontrollApi.post(
            `/attachment/add/${kontrollId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return { status, ...data };
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        errorHandler(error);
        throw new Error(error);
    }
};

export const getAttachmentListByKontroll = async (
    kontrollId: number
): Promise<{
    status: number;
    attachments?: Attachment[];
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/attachment/list/${kontrollId}`
        );

        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        throw new Error(error);
    }
};
