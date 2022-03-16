import { Klient } from '../../contracts/kontrollApi';
import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

export function useExternalKlienter() {
    return useQuery('klient', async () => {
        const { data } = await sluttkontrollApi.get<{
            klienter: Klient[];
        }>(`/klient/access-by-external`);
        return data.klienter;
    });
}
