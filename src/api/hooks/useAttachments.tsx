import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Attachment } from '../../contracts/attachmentApi';
import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useAttachments({ kontrollId }: { kontrollId?: number }) {
    return useQuery(
        ['attachments', ...(kontrollId ? ['kontroll', kontrollId] : [])],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                attachments: Attachment[];
            }>(`/attachment`, {
                params: {
                    ...(kontrollId ? { kontrollId } : {})
                }
            });
            return data.attachments;
        }
    );
}

export function useAddAttachment() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Attachment,
        unknown,
        {
            kontrollId: number;
            attachment: File;
            name: string;
            description: string;
        }
    >(
        async (body) => {
            const formData = new FormData();

            formData.append('attachment', body.attachment);
            formData.append(
                'data',
                JSON.stringify({
                    name: body.name,
                    description: body.description
                })
            );

            const { data } = await sluttkontrollApi.post<{
                attachment: Attachment;
            }>(`/attachment/add/${body.kontrollId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data.attachment;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (updatedAttachment, vars) => {
                const attachments = queryClient.getQueryData<Attachment[]>([
                    'attachments',
                    ...(vars.kontrollId ? ['kontroll', vars.kontrollId] : [])
                ]);
                // ✅ update detail view directly

                if (attachments && attachments?.length > 0) {
                    queryClient.setQueryData(
                        [
                            'attachments',
                            ...(vars.kontrollId
                                ? ['kontroll', vars.kontrollId]
                                : [])
                        ],
                        unionBy([updatedAttachment], attachments, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries([
                    'attachments',
                    ...(vars.kontrollId ? ['kontroll', vars.kontrollId] : [])
                ]);

                enqueueSnackbar('Vedlegg lastet opp', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Navn eller fil mangler', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}

export function useDeleteAttachment() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            attachmentId: number;
            kontrollId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.delete(
                `/attachment/${body.attachmentId}`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const attachments = queryClient.getQueryData<Attachment[]>([
                    'attachments',
                    ...(vars.kontrollId ? ['kontroll', vars.kontrollId] : [])
                ]);
                // ✅ update detail view directly

                if (attachments && attachments?.length > 0) {
                    queryClient.setQueryData(
                        [
                            'attachments',
                            ...(vars.kontrollId
                                ? ['kontroll', vars.kontrollId]
                                : [])
                        ],
                        attachments.filter((a) => a.id !== vars.attachmentId)
                    );
                }
                queryClient.invalidateQueries([
                    'attachments',
                    ...(vars.kontrollId ? ['kontroll', vars.kontrollId] : [])
                ]);

                enqueueSnackbar('Vedlegg er slettet', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                enqueueSnackbar('Feil ved sletting av vedlegg', {
                    variant: 'warning'
                });
            }
        }
    );
}
