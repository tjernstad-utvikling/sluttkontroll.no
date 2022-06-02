import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { getReportSetting, getReportStatement } from '../../api/reportApi';

import { OutputData } from '@editorjs/editorjs';
import { ReportSetting } from '../../contracts/reportApi';
import { errorHandler } from '../../tools/errorHandler';

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
    kontrollId: number;
}
export async function handleReportSettings({
    kontrollId,
    setReportSetting
}: HandleReportSettingsOptions) {
    try {
        const { status, rapportSetting } = await getReportSetting(kontrollId);

        if (status === 200) {
            setReportSetting(rapportSetting);
        }
    } catch (error: any) {}
}
