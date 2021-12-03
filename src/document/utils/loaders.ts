import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { getReportSetting, getReportStatement } from '../../api/reportApi';

import { OutputData } from '@editorjs/editorjs';
import { ReportKontroll } from '../../contracts/kontrollApi';
import { ReportSetting } from '../../contracts/reportApi';
import { errorHandler } from '../../tools/errorHandler';
import { format } from 'date-fns';

export async function loadReportStatement(
    kontrollId: number,
    enqueueSnackbar: (
        message: SnackbarMessage,
        options?: OptionsObject | undefined
    ) => SnackbarKey
): Promise<OutputData | undefined> {
    try {
        const { status, rapportStatement: text } = await getReportStatement(
            kontrollId
        );
        if (status === 200 && text) {
            return text;
        }
    } catch (error: any) {
        enqueueSnackbar('Feil ved henting av kontrollerklæring');
        errorHandler(error);
    }
}

interface HandleReportSettingsOptions {
    setReportSetting: React.Dispatch<
        React.SetStateAction<ReportSetting | undefined>
    >;
    kontroll: ReportKontroll;
}
export async function handleReportSettings({
    kontroll,
    setReportSetting
}: HandleReportSettingsOptions) {
    try {
        const { status, rapportSetting } = await getReportSetting(kontroll.id);
        console.log({ status, rapportSetting });
        if (status === 200) {
            if (!rapportSetting) {
                const _reportSetting = {} as ReportSetting;

                _reportSetting.modules = [];
                _reportSetting.reportTitle = '3. Partskontroll';

                let date = new Date();
                if (kontroll.completedDate !== null) {
                    date = new Date(kontroll.completedDate);
                }
                _reportSetting.reportDate = format(date, 'yyyy-MM-dd');
                _reportSetting.reportSite =
                    kontroll.rapportEgenskaper?.kontrollsted || '';
                _reportSetting.selectedSkjemaer = [];

                setReportSetting(_reportSetting);
            } else if (rapportSetting) {
                setReportSetting(rapportSetting);
            }
        }
    } catch (error: any) {}
}
