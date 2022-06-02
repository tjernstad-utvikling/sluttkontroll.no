import { Roles, User } from '../../contracts/userApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { StorageKeys } from '../../contracts/keys';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useUsers() {
    return useQuery(['users'], async () => {
        const { data } = await sluttkontrollApi.get<{
            users: User[];
        }>('/user/users');
        return data.users;
    });
}
export function useCurrentUser() {
    return useQuery(
        ['users', 'current'],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                user: User;
            }>('/user/me');
            localStorage.setItem(
                StorageKeys.currentUser,
                JSON.stringify(data.user)
            );
            return data.user;
        },
        {
            initialData: () => {
                const jsonValue = localStorage.getItem(StorageKeys.currentUser);
                const currentUser: User =
                    jsonValue != null ? JSON.parse(jsonValue) : undefined;
                return currentUser;
            }
        }
    );
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

export function useNewUser() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        User,
        unknown,
        {
            name: string;
            email: string;
            phone: string;
            roles: Roles[] | undefined;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                user: User;
            }>('/user/', {
                ...body,
                roles: body.roles !== undefined ? body.roles : [Roles.ROLE_USER]
            });
            return data.user;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (newUser) => {
                const users = queryClient.getQueryData<User[]>(['users']);
                // ✅ update detail view directly

                if (users && users?.length > 0) {
                    queryClient.setQueryData(
                        ['users'],
                        unionBy([newUser], users, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries(['users']);

                enqueueSnackbar('Ny bruker lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    if (error.response.message === 'user_exists') {
                        enqueueSnackbar(
                            'Epostadressen er allerede registrert',
                            {
                                variant: 'warning'
                            }
                        );
                    } else if (error.response.message === 'user_data_missing') {
                        enqueueSnackbar('Epost eller navn mangler', {
                            variant: 'warning'
                        });
                    }
                } else {
                    enqueueSnackbar('Problemer med lagring av bruker', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            user: User;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/user/${body.user.id}`,
                {
                    ...body.user,
                    sertifikater: null
                }
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const users = queryClient.getQueryData<User[]>(['users']);
                // ✅ update detail view directly

                if (users && users?.length > 0) {
                    queryClient.setQueryData(
                        ['users', vars.user.id],
                        vars.user
                    );
                }
                queryClient.invalidateQueries(['users']);

                enqueueSnackbar('Bruker lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    if (error.response.message === 'user_exists') {
                        enqueueSnackbar(
                            'Epostadressen er allerede registrert',
                            {
                                variant: 'warning'
                            }
                        );
                    } else if (error.response.message === 'user_data_missing') {
                        enqueueSnackbar('Epost eller navn mangler', {
                            variant: 'warning'
                        });
                    }
                } else {
                    enqueueSnackbar('Problemer med lagring av bruker', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}

export function useUpdateCurrentUser() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            name: string;
            email: string;
            phone: string;
            roles: Roles[];
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put('/user/', {
                ...body
            });
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const user = queryClient.getQueryData<User>([
                    'users',
                    'current'
                ]);
                // ✅ update detail view directly

                if (user) {
                    queryClient.setQueryData(['users', 'current'], {
                        ...user,
                        ...vars
                    });
                }
                queryClient.invalidateQueries(['users']);

                enqueueSnackbar('Profil oppdatert', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    if (error.response.message === 'user_exists') {
                        enqueueSnackbar(
                            'Epostadressen er allerede registrert',
                            {
                                variant: 'warning'
                            }
                        );
                    } else if (error.response.message === 'user_data_missing') {
                        enqueueSnackbar('Epost eller navn mangler', {
                            variant: 'warning'
                        });
                    }
                } else {
                    enqueueSnackbar('Problemer med lagring av bruker', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}
