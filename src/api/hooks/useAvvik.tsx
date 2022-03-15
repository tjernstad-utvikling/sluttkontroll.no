import { useQuery, useQueryClient } from 'react-query';

import { Avvik } from '../../contracts/avvikApi';
import sluttkontrollApi from '../sluttkontroll';

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
