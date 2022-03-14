import { Checklist, Kontroll, Skjema } from '../../contracts/kontrollApi';

import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

export function useExternalKontroller() {
    return useQuery('externalKontroll', () => getKontrollerForExternal());
}
const getKontrollerForExternal = async () => {
    const { data } = await sluttkontrollApi.get<{
        kontroller: Kontroll[];
        skjemaer: Skjema[];
        checklists: Checklist[];
    }>(`/kontroll/access-by-external`);
    return data;
};
