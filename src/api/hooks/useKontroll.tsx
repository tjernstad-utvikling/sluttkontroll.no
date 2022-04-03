import { Checklist, Kontroll, Skjema } from '../../contracts/kontrollApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useExternalKontroller() {
    return useQuery('externalKontroll', async () => {
        const { data } = await sluttkontrollApi.get<{
            kontroller: Kontroll[];
            skjemaer: Skjema[];
            checklists: Checklist[];
        }>(`/kontroll/access-by-external`);
        return data;
    });
}

export function useKontroller({
    includeDone,
    clientId,
    locationId
}: {
    includeDone: boolean;
    clientId?: number;
    locationId?: number;
}) {
    return useQuery(
        [
            'kontroll',
            includeDone ? 'all' : 'open',
            ...(locationId
                ? ['location', locationId]
                : clientId
                ? ['client', clientId]
                : [])
        ],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                kontroller: Kontroll[];
            }>(`/kontroll`, {
                params: {
                    ...(includeDone ? { all: true } : {}),
                    ...(locationId
                        ? { locationId }
                        : clientId
                        ? { clientId }
                        : {})
                }
            });
            return data.kontroller;
        }
    );
}

export function useKontrollById(kontrollId: number | undefined) {
    const queryClient = useQueryClient();
    return useQuery(
        ['kontroll', kontrollId],
        async () => {
            const { data } = await sluttkontrollApi.get<{ kontroll: Kontroll }>(
                `/kontroll/${kontrollId}`
            );
            return data.kontroll;
        },
        {
            initialData: () => {
                return queryClient
                    .getQueryData<Kontroll[]>('kontroll')
                    ?.find((k) => k.id === kontrollId);
            },

            // The query will not execute until the userId exists
            enabled: !!kontrollId
        }
    );
}

export function useUpdateKontroll() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Kontroll,
        unknown,
        {
            id: number;
            name: string;
            user: { id: number };
            avvikUtbedrere: {
                id: number;
            }[];
            kommentar: string;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put<{ kontroll: Kontroll }>(
                `/kontroll/${body.id}`,
                { ...body }
            );
            return data.kontroll;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updatedKontroll) => {
                const kontroller =
                    queryClient.getQueryData<Kontroll[]>('kontroll');
                // ✅ update detail view directly

                if (kontroller && kontroller?.length > 0) {
                    queryClient.setQueryData(
                        'kontroll',
                        unionBy([updatedKontroll], kontroller, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries('kontroll');

                enqueueSnackbar('Kontroll oppdatert', {
                    variant: 'success'
                });
            }
        }
    );
}
