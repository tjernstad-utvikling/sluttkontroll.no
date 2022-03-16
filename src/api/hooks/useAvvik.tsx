import { Avvik, AvvikBilde } from '../../contracts/avvikApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

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

export function useCloseAvvik({
    isFromDetailsPage
}: {
    isFromDetailsPage?: boolean;
}) {
    const queryClient = useQueryClient();
    return useMutation<
        Avvik[],
        unknown,
        { avvikList: number[]; kommentar: string }
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
            onSuccess: (updatedAvvik) => {
                if (isFromDetailsPage) {
                    queryClient.setQueryData(
                        ['avvik', updatedAvvik[0].id],
                        updatedAvvik[0]
                    );
                }
                const avvikArray = queryClient.getQueryData<Avvik[]>('avvik');
                // ✅ update detail view directly

                if (avvikArray && avvikArray?.length > 0) {
                    queryClient.setQueryData(
                        'avvik',
                        unionBy(updatedAvvik, avvikArray, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries('avvik');
            }
        }
    );
}

export function useAddAvvikImages({
    isFromDetailsPage
}: {
    isFromDetailsPage?: boolean;
}) {
    const queryClient = useQueryClient();
    return useMutation<AvvikBilde[], unknown, { avvik: Avvik; images: File[] }>(
        async ({ avvik, images }) => {
            const formData = new FormData();

            images.forEach((file) => {
                formData.append('images', file);
            });

            const { data } = await sluttkontrollApi.post<{
                avvikBilder: AvvikBilde[];
            }>(`/avvik/bilder/add/${avvik.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return data.avvikBilder;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (avvikBilder, { avvik }) => {
                const avvikArray = queryClient.getQueryData<Avvik[]>('avvik');
                // ✅ update detail view directly

                const updatedAvvik = {
                    ...avvik,
                    avvikBilder: [...avvik.avvikBilder, ...avvikBilder]
                };

                if (isFromDetailsPage) {
                    queryClient.setQueryData(['avvik', avvik.id], updatedAvvik);
                }
                if (avvikArray && avvikArray?.length > 0) {
                    queryClient.setQueryData(
                        'avvik',
                        unionBy([updatedAvvik], avvikArray, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                    return;
                }
                queryClient.invalidateQueries('avvik');
            }
        }
    );
}
