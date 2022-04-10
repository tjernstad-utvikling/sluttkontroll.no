import { RapportEgenskaper, ReportModules } from '../contracts/reportApi';

import FormControlLabel from '@mui/material/FormControlLabel';
import { ReportPropertiesSchema } from '../schema/reportProperties';
import Switch from '@mui/material/Switch';
import { useClients } from '../api/hooks/useKlient';
import { useEffect } from 'react';
import { useReport } from '../document/documentContainer';
import { useState } from 'react';
import { useUpdateReportKontroll } from '../api/hooks/useKontroll';

interface ReportSwitchProps {
    id: ReportModules;
    label: string;
}
export const ReportSwitch = ({ id, label }: ReportSwitchProps) => {
    const { isModuleActive, toggleModuleVisibilityState } = useReport();
    return (
        <FormControlLabel
            control={
                <Switch
                    checked={isModuleActive(id)}
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

    const [showPropertiesForm, setShowPropertiesForm] = useState<boolean>(true);

    const reportPropertiesMutation = useUpdateReportKontroll();

    const clientData = useClients();

    const saveReportProperties = async (
        reportProperties: RapportEgenskaper
    ) => {
        try {
            if (kontroll !== undefined) {
                await reportPropertiesMutation.mutateAsync({
                    kontrollId: kontroll.id,
                    reportProperties
                });
            }
        } catch (error: any) {
            console.log(error);
            return false;
        } finally {
            updateKontroll();
            setShowPropertiesForm(false);

            return true;
        }
    };

    useEffect(() => {
        if (kontroll !== undefined) {
            if (kontroll.rapportEgenskaper !== null) {
                setShowPropertiesForm(false);
            }
        }
    }, [kontroll]);

    if (kontroll !== undefined && clientData.data !== undefined) {
        if (showPropertiesForm) {
            return (
                <ReportPropertiesSchema
                    onSubmit={saveReportProperties}
                    kontroll={kontroll}
                    klienter={clientData.data}
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
    const { isModuleActive } = useReport();
    if (isModuleActive(dependency)) {
        return <>{children}</>;
    }
    return <div />;
};
