import { User } from '../contracts/userApi';
import sluttkontrollApi from './sluttkontroll';

export const getUsers = async (): Promise<{
    status: number;
    users: Array<User>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/v3/user/users');
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};
