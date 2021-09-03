import { Checkpoint } from '../contracts/checkpointApi';
import sluttkontrollApi from './sluttkontroll';

export const getCheckpoints = async (): Promise<{
    status: number;
    checkpoints: Array<Checkpoint>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/v3/checkpoint/');
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        throw new Error(error);
    }
};
