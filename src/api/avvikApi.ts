import { Checkpoint } from '../contracts/checkpointApi';
import sluttkontrollApi from './sluttkontroll';

export const getAvvikByKontrollList = async (
    ids: Array<number>
): Promise<{
    status: number;
    Avvik: Array<Checkpoint>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/v3/avvik/kontroll-list/${ids.join()}`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};
