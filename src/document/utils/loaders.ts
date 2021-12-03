import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { getReportSetting, getReportStatement } from '../../api/reportApi';

import { ReportKontroll } from '../../contracts/kontrollApi';
import { ReportSetting } from '../../contracts/reportApi';
import { format } from 'date-fns';
import { getImageFile } from '../../api/imageApi';

export async function loadReportStatement(
    kontrollId: number
): Promise<OutputData | undefined> {
    try {
        const { status, rapportStatement: text } = await getReportStatement(
            kontrollId
        );
        let _blocks: OutputBlockData<string, any>[] = [];
        if (status === 200 && text) {
            for (let block of text.blocks) {
                if (block.type === 'image') {
                    const res = await getImageFile(block.data.file.url);

                    if (res.status === 200) {
                        block.data.file.url = URL.createObjectURL(res.data);
                        _blocks = [..._blocks, block];
                    }
                } else {
                    _blocks = [..._blocks, block];
                }
            }
            return { ...text, blocks: _blocks };
        }
    } catch (error: any) {
        throw new Error(error);
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
        const { status, setting } = await getReportSetting(kontroll.id);
        if (status === 200) {
            if (!setting) {
                const reportSetting = {} as ReportSetting;

                reportSetting.modules = [];
                reportSetting.reportTitle = '3. Partskontroll';

                let date = new Date();
                if (kontroll.completedDate !== null) {
                    date = new Date(kontroll.completedDate);
                }
                reportSetting.reportDate = format(date, 'dd.MM.yyyy');
                reportSetting.reportSite =
                    kontroll.rapportEgenskaper?.kontrollsted || '';
                reportSetting.selectedSkjemaer = [];

                setReportSetting(reportSetting);
            } else if (setting) {
                setReportSetting(setting);
            }
        }
    } catch (error: any) {}
}
