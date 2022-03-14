import { Avvik } from '../../contracts/avvikApi';
import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

export function useAssignedAvvik() {
    return useQuery('assignedAvvik', () => getAssignedAvvik());
}
const getAssignedAvvik = async () => {
    const { data } = await sluttkontrollApi.get<{ avvik: Avvik[] }>(
        `/avvik/assigned`
    );
    return data.avvik;
};