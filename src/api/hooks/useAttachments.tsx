import { Attachment } from '../../contracts/attachmentApi';
import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

export function useAttachments({ kontrollId }: { kontrollId?: number }) {
    return useQuery(
        ['attachments', ...(kontrollId ? ['kontroll', kontrollId] : [])],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                attachments: Attachment[];
            }>(`/kontroll`, {
                params: {
                    ...(kontrollId ? { kontrollId } : {})
                }
            });
            return data.attachments;
        }
    );
}
