import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Avvik } from '../../contracts/avvikApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';

export function useAssignedAvvik() {
    return useQuery('avvik', async () => {
        const { data } = await sluttkontrollApi.get<{ avvik: Avvik[] }>(
            `/avvik/assigned`
        );
        return data.avvik;
    });
}

export function useAvvikById(avvikId: number) {
    const queryClient = useQueryClient();
    return useQuery(
        ['avvik', avvikId],
        async () => {
            const { data } = await sluttkontrollApi.get<{ avvik: Avvik }>(
                `/avvik/${avvikId}`
            );
            return data.avvik;
        },
        {
            initialData: () => {
                return queryClient
                    .getQueryData<Avvik[]>('avvik')
                    ?.find((a) => a.id === avvikId);
            }
        }
    );
}

export function useCloseAvvik() {
    const queryClient = useQueryClient();
    return useMutation<
        Avvik[],
        unknown,
        { avvikList: number[]; kommentar: string; isFromDetailsPage?: boolean }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{ avvik: Avvik[] }>(
                '/avvik/close',
                body
            );
            return data.avvik;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updatedAvvik, bodyVars) => {
                const oldArray = queryClient.getQueryData<Avvik[]>('avvik');
                // ✅ update detail view directly

                queryClient.setQueryData(
                    'avvik',
                    unionBy(updatedAvvik, oldArray, 'id').sort(
                        (a, b) => a.id - b.id
                    )
                );
            }
        }
    );
}
