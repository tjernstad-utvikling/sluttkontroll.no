import { Sertifikat } from '../contracts/certificate';
import { User } from '../contracts/userApi';
import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

export const getSertifikatByUser = async (
    user: User
): Promise<{
    status: number;
    certificates: Sertifikat;
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
