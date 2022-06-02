import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

export function useZipCode({ code }: { code: string }) {
    return useQuery(
        ['zipCode', code],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                sted: {
                    postnummer: string;
                    poststed: string;
                    kommunenummer: string;
                    kommunenavn: string;
                    kategori: string;
                };
            }>(`/utils/zipCode`, {
                params: {
                    code
                }
            });
            return data.sted;
        },
        {
            staleTime: 1000 * 3600,
            enabled: !!code && !(code.length < 4) && !(code.length > 4)
        }
    );
}
