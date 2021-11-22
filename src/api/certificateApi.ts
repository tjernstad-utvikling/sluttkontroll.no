import { Sertifikat, SertifikatType } from '../contracts/certificateApi';

import { User } from '../contracts/userApi';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const getSertifikatByUser = async (
    user: User
): Promise<{
    status: number;
    certificates: Sertifikat[];
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/certificate/${user.id}`
        );

        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        throw new Error(error);
    }
};
export const saveNewSertifikat = async (
    number: string,
    typeId: number,
    validTo: string,
    userId: number
): Promise<{
    status: number;
    certificate: Sertifikat;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post('/certificate', {
            number,
            typeId,
            validTo,
            userId
        });

        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        throw new Error(error);
    }
};
export const getSertifikatTypes = async (): Promise<{
    status: number;
    certificateTypes: SertifikatType[];
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            '/certificate/types'
        );

        return { status, ...data };
    } catch (error: any) {
        errorHandler(error);
        throw new Error(error);
    }
};
