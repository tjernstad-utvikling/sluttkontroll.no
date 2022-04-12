import { Sertifikat, SertifikatType } from '../../contracts/certificateApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useCertificate({ userId }: { userId?: number }) {
    return useQuery(
        ['certificate'],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                certificates: Sertifikat[];
            }>(`/certificate/${userId}`);
            return data.certificates;
        },
        {
            enabled: !!userId
        }
    );
}

export function useCertificateTypes() {
    return useQuery(
        ['certificateTypes'],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                certificateTypes: SertifikatType[];
            }>('/certificate/types');
            return data.certificateTypes;
        },
        {
            staleTime: 1000 * 3600
        }
    );
}

export function useAddCertificate() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Sertifikat,
        unknown,
        {
            number: string;
            typeId: number;
            validTo: string;
            userId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                certificate: Sertifikat;
            }>('/certificate', { ...body });
            return data.certificate;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (newCertificate, vars) => {
                const certificates = queryClient.getQueryData<Sertifikat[]>([
                    'certificate'
                ]);
                // ✅ update detail view directly

                if (certificates && certificates.length > 0) {
                    queryClient.setQueryData(
                        ['measurements'],
                        unionBy([newCertificate], certificates, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }

                enqueueSnackbar('Sertifikat lagret', {
                    variant: 'success'
                });

                queryClient.invalidateQueries(['certificate']);
            },
            onError: (error: any) => {
                if (
                    error.response.status === 400 ||
                    error.response.status === 404
                ) {
                    enqueueSnackbar(
                        'Det mangler opplysninger for lagring, sjekk at alle felter er fylt ut',
                        {
                            variant: 'warning'
                        }
                    );
                } else {
                    enqueueSnackbar('Feil ved lagring av sertifikat', {
                        variant: 'warning'
                    });
                }
            }
        }
    );
}
