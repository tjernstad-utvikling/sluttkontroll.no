import { RapportEgenskaper, ReportModules } from '../contracts/reportApi';

import FormControlLabel from '@mui/material/FormControlLabel';
import { ReportPropertiesSchema } from '../schema/reportProperties';
import Switch from '@mui/material/Switch';
import { saveKontrollReportData } from '../api/kontrollApi';
import { useClient } from '../data/klient';
import { useEffect } from 'react';
import { useReport } from '../document/documentContainer';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

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
