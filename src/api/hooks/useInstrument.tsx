import { Instrument } from '../../contracts/instrumentApi';
import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

export function useInstruments() {
    return useQuery(['instrument'], async () => {
        const { data } = await sluttkontrollApi.get<{
            instruments: Instrument[];
        }>('/instrument/', {});
        return data.instruments;
    });
}

export function useInstrument({ instrumentId }: { instrumentId?: number }) {
    return useQuery(
        ['instrument', instrumentId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                instrument: Instrument;
            }>(`/instrument/${instrumentId}`, {});
            return data.instrument;
        },
        {
            enabled: !!instrumentId
        }
    );
}
