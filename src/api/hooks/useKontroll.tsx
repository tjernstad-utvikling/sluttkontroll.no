import { Checklist, Kontroll, Skjema } from '../../contracts/kontrollApi';

import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

export function useKontrollerByIds(kontrollIds: number[]) {
    return useQuery('assignedAvvik', () => getKontrollerByIds(kontrollIds), {
        enabled: kontrollIds.length > 0
    });
}
const getKontrollerByIds = async (kontrollIds: number[]) => {
    const { data } = await sluttkontrollApi.get<{
        kontroller: Kontroll[];
        skjemaer: Skjema[];
        checklists: Checklist[];
    }>(`/kontroll/kontroll-list/${kontrollIds.join()}`);
    return data;
};
