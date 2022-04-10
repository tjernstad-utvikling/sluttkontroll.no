import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack';
import { getReportSetting, getReportStatement } from '../../api/reportApi';

import { Attachment } from '../../contracts/attachmentApi';
import { OutputData } from '@editorjs/editorjs';
import { ReportSetting } from '../../contracts/reportApi';
import { errorHandler } from '../../tools/errorHandler';
import { getAttachmentListByKontroll } from '../../api/attachmentApi';

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
export async function loadAttachments(
    kontrollId: number,
    enqueueSnackbar: (
        message: SnackbarMessage,
        options?: OptionsObject | undefined
    ) => SnackbarKey
): Promise<Attachment[] | undefined> {
    try {
        const { status, attachments } = await getAttachmentListByKontroll(
            kontrollId
        );
        if (status === 200 && attachments) {
            return attachments;
        }
    } catch (error: any) {
        enqueueSnackbar('Feil ved henting av Vedlegg');
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
