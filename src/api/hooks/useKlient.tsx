import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Klient } from '../../contracts/kontrollApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useExternalKlienter() {
    return useQuery('klient', async () => {
        const { data } = await sluttkontrollApi.get<{
            klienter: Klient[];
        }>(`/klient/access-by-external`);
        return data.klienter;
    });
}

export function useClients() {
    return useQuery(['klient'], async () => {
        const { data } = await sluttkontrollApi.get<{
            klienter: Klient[];
        }>(`/klient`);
        return data.klienter;
    });
}
export function useClientById({ clientId }: { clientId: number }) {
    const queryClient = useQueryClient();
    return useQuery(
        ['klient', clientId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                klient: Klient;
            }>(`/klient/${clientId}`);
            return data.klient;
        },
        {
            initialData: () => {
                return queryClient
                    .getQueryData<Klient[]>(['klient'])
                    ?.find((k) => k.id === clientId);
            },
            // The query will not execute until the userId exists
            enabled: !!clientId
        }
    );
}

export function useAddNewClient() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Klient,
        unknown,
        {
            name: string;
            setClient: (client: Klient) => void;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                klient: Klient;
            }>('/klient/', {
                name: body.name
            });
            return data.klient;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (nweClient, vars) => {
                const klienter = queryClient.getQueryData<Klient[]>(['klient']);
                // ✅ update detail view directly

                vars.setClient(nweClient);
                if (klienter && klienter?.length > 0) {
                    queryClient.setQueryData(
                        ['klient'],
                        unionBy([nweClient], klienter, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries(['klient']);

                enqueueSnackbar('Ny kunde er lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Navn mangler', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar(
                        'Problemer med lagring av kontrollegenskaper',
                        {
                            variant: 'error'
                        }
                    );
                }
            }
        }
    );
}

export function useUpdateClient() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            name: string;
            clientId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/klient/${body.clientId}`,
                {
                    name: body.name
                }
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const klienter = queryClient.getQueryData<Klient[]>(['klient']);
                // ✅ update detail view directly

                const client = klienter?.find((k) => k.id === vars.clientId);

                if (client) {
                    queryClient.setQueryData(
                        ['klient'],
                        unionBy(
                            [{ ...client, name: vars.name }],
                            klienter,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );

                    queryClient.setQueryData(['klient', vars.clientId], {
                        ...client,
                        name: vars.name
                    });
                }
                queryClient.invalidateQueries(['klient']);

                enqueueSnackbar('Kunde er oppdatert', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Navn mangler', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar('Problemer med lagring av kunde', {
                        variant: 'error'
                    });
                }
            }
        }
    );
}
