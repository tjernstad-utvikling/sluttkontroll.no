import { ReportModules, useReport } from '../document/documentContainer';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import { PDFViewer } from '@react-pdf/renderer';
import { RapportEgenskaper } from '../contracts/kontrollApi';
import { Report } from '../document/report';
import { ReportPropertiesSchema } from '../schema/reportProperties';
import Switch from '@material-ui/core/Switch';
import { saveKontrollReportData } from '../api/kontrollApi';
import { useClient } from '../data/klient';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
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

interface ReportPropertiesViewerProps {
    children: React.ReactNode;
}
export const ReportPropertiesViewer = ({
    children
}: ReportPropertiesViewerProps) => {
    const { kontroll, updateKontroll } = useReport();
    const { enqueueSnackbar } = useSnackbar();
    const {
        state: { klienter }
    } = useClient();

    const [showPropertiesForm, setShowPropertiesForm] = useState<boolean>(true);

    const saveReportProperties = async (
        reportProperties: RapportEgenskaper
    ) => {
        try {
            if (kontroll !== undefined) {
                const response = await saveKontrollReportData(
                    kontroll.id,
                    reportProperties
                );
                if (response.status === 400) {
                    enqueueSnackbar('Et eller flere felter mangler data', {
                        variant: 'warning'
                    });
                }
                if (
                    response.status === 200 &&
                    response.kontroll !== undefined
                ) {
                    updateKontroll(response.kontroll);
                    setShowPropertiesForm(false);
                    enqueueSnackbar('Rapportegenskaper er lagret', {
                        variant: 'success'
                    });
                    return true;
                }
            }
            return false;
        } catch (error: any) {
            enqueueSnackbar('Problemer med lagring av kontrollegenskaper', {
                variant: 'error'
            });
            return false;
        }
    };

    useEffect(() => {
        if (kontroll !== undefined) {
            if (kontroll.rapportEgenskaper !== null) {
                setShowPropertiesForm(false);
            }
        }
    }, [kontroll]);

    if (kontroll !== undefined && klienter !== undefined) {
        if (showPropertiesForm) {
            return (
                <ReportPropertiesSchema
                    onSubmit={saveReportProperties}
                    kontroll={kontroll}
                    klienter={klienter}
                />
            );
        } else {
            return <>{children}</>;
        }
    }
    return <div />;
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
