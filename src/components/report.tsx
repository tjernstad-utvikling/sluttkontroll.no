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
        filteredSkjemaer,
        checklists,
        avvik,
        measurements,
        measurementTypes
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
                hasSkjemaPage={
                    visibleReportModules.includes(ReportModules.skjemaPage) &&
                    visibleReportModules.includes(ReportModules.controlModule)
                }
                skjemaer={filteredSkjemaer}
                checklists={checklists}
                avvik={avvik}
                hasMeasurementPage={
                    visibleReportModules.includes(
                        ReportModules.measurementPage
                    ) &&
                    visibleReportModules.includes(
                        ReportModules.controlModule
                    ) &&
                    !visibleReportModules.includes(
                        ReportModules.inlineMeasurementModule
                    )
                }
                hasInlineMeasurements={
                    visibleReportModules.includes(
                        ReportModules.measurementPage
                    ) &&
                    visibleReportModules.includes(
                        ReportModules.inlineMeasurementModule
                    )
                }
                measurements={measurements}
                measurementTypes={measurementTypes}
            />
        </PDFViewer>
    );
};

interface BlockProps {
    dependency: ReportModules;
    children: React.ReactNode;
}
export const Block = ({ dependency, children }: BlockProps) => {
    const { visibleReportModules } = useReport();
    if (visibleReportModules.includes(dependency)) {
        return <>{children}</>;
    }
    return <div />;
};
