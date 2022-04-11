import { User } from '../../contracts/userApi';
import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

export function useUsers() {
    return useQuery(['users'], async () => {
        const { data } = await sluttkontrollApi.get<{
            users: User[];
        }>('/user/users');
        return data.users;
    });
}

export function useUserById({ userId }: { userId: number }) {
    return useQuery(
        ['users', userId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                user: User;
            }>(`/user/${userId}`);
            return data.user;
        },
        {
            enabled: !!userId
        }
    );
}
