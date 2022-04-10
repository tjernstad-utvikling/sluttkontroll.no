import { ReportSetting } from '../../contracts/reportApi';
import sluttkontrollApi from '../sluttkontroll';
import { useQuery } from 'react-query';

// export function useReportSettings({ kontrollId }: { kontrollId?: number }) {
//     return useQuery(
//         ['report-setting', 'kontroll', kontrollId],
//         async () => {
//             const { data } = await sluttkontrollApi.get<{
//                 rapportSetting: ReportSetting;
//             }>(`/report/setting/${kontrollId}`);

//             return data.rapportSetting;
//         },
//         {
//             // The query will not execute until the kontrollId exists
//             enabled: !!kontrollId
//         }
//     );
// }
