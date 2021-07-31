import { ReportModules, useReport } from '../document/documentContainer';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import { PDFViewer } from '@react-pdf/renderer';
import { Report } from '../document/report';
import Switch from '@material-ui/core/Switch';
import { useWindowSize } from '../hooks/useWindowSize';

interface ReportSwitchProps {
    id: ReportModules;
    label: string;
}
export const ReportSwitch = ({ id, label }: ReportSwitchProps) => {
    const { visibleReportModules, toggleModuleVisibilityState } = useReport();
    return (
        <FormControlLabel
            control={
                <Switch
                    checked={visibleReportModules.includes(id)}
                    onChange={() => toggleModuleVisibilityState(id)}
                    name={id}
                    color="primary"
                />
            }
            label={label}
        />
    );
};

export const ReportViewer = () => {
    const {
        visibleReportModules,
        frontPageData,
        infoText,
        kontroll,
        skjemaer
    } = useReport();

    const size = useWindowSize();

    return (
        <PDFViewer height={size.height - 120}>
            <Report
                hasFrontPage={visibleReportModules.includes(
                    ReportModules.frontPage
                )}
                frontPageData={frontPageData}
                hasInfoPage={visibleReportModules.includes(
                    ReportModules.infoPage
                )}
                infoText={infoText}
                kontroll={kontroll}
                hasSkjemaPage={visibleReportModules.includes(
                    ReportModules.skjemaPage
                )}
                skjemaer={skjemaer}
            />
        </PDFViewer>
    );
};
