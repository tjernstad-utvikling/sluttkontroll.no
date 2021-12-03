import { Checklist, ReportKontroll, Skjema } from '../contracts/kontrollApi';
import { Measurement, MeasurementType } from '../contracts/measurementApi';
import { ReportModules, ReportSetting } from '../contracts/reportApi';
import { createContext, useContext, useState } from 'react';
import { handleReportSettings, loadReportStatement } from './utils/loaders';

import { Avvik } from '../contracts/avvikApi';
import { OutputData } from '@editorjs/editorjs';
import { getInfoText } from '../api/settingsApi';
import { getKontrollReportData } from '../api/kontrollApi';
import { useAvvik } from '../data/avvik';
import { useEffect } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { useUser } from '../data/user';

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useReport = () => {
    return useContext(Context);
};

export const DocumentContainer = ({
    children,
    kontrollId,
    objectId
}: {
    children: React.ReactNode;
    kontrollId: number;
    objectId: number;
}): JSX.Element => {
    const [kontroll, setKontroll] = useState<ReportKontroll>();
    const [reportSetting, setReportSetting] = useState<ReportSetting>();

    const [_infoText, setInfoText] = useState<OutputData>();
    const [_statementText, setStatementText] = useState<OutputData>();

    const {
        state: { skjemaer, checklists },
        loadKontrollerByObjekt
    } = useKontroll();
    const [_skjemaer, setSkjemaer] = useState<Skjema[]>();
    const [filteredSkjemaer, setFilteredSkjemaer] = useState<Skjema[]>();

    const {
        state: { avvik },
        loadAvvikByKontroller
    } = useAvvik();

    const {
        state: { measurements, measurementTypes }
    } = useMeasurement();

    const { loadUsers } = useUser();

    useEffectOnce(async () => {
        loadUsers();
        const { kontroll: _kontroll } = await getKontrollReportData(kontrollId);

        setKontroll(_kontroll);
        await handleReportSettings({
            kontroll: _kontroll,
            setReportSetting
        });

        const { infoText } = await getInfoText();
        setInfoText(infoText);
        loadKontrollerByObjekt(objectId);
        loadAvvikByKontroller([_kontroll]);

        setStatementText(await loadReportStatement(kontrollId));
    });

    useEffect(() => {
        if (skjemaer !== undefined) {
            setSkjemaer(skjemaer.filter((s) => s.kontroll.id === kontrollId));
            if (reportSetting?.selectedSkjemaer.length === 0) {
                setFilteredSkjemaer(
                    skjemaer.filter((s) => s.kontroll.id === kontrollId)
                );
            } else {
                setFilteredSkjemaer(
                    skjemaer.filter((s) =>
                        reportSetting?.selectedSkjemaer.includes(s.id)
                    )
                );
            }
        }
    }, [skjemaer, kontrollId, reportSetting?.selectedSkjemaer]);

    const toggleModuleVisibilityState = (id: ReportModules) => {
        if (reportSetting) {
            if (reportSetting.modules.includes(id)) {
                setReportSetting((prev) => {
                    if (prev) {
                        return {
                            ...prev,
                            modules: prev.modules.filter((vrm) => vrm !== id)
                        };
                    }
                });
            } else {
                setReportSetting((prev) => {
                    if (prev) {
                        return {
                            ...prev,
                            modules: [...prev.modules, id]
                        };
                    }
                });
            }
        }
    };

    const isModuleActive = (reportModule: ReportModules): boolean => {
        return reportSetting?.modules.includes(reportModule) || false;
    };

    const updateKontroll = (reportKontroll: ReportKontroll) => {
        setKontroll(reportKontroll);
    };

    return (
        <Context.Provider
            value={{
                toggleModuleVisibilityState,
                isModuleActive,
                infoText: _infoText,
                statementText: _statementText,
                setStatementText,
                reportSetting,
                setReportSetting,

                kontroll,
                updateKontroll,
                skjemaer: _skjemaer,
                filteredSkjemaer,
                setFilteredSkjemaer,
                checklists,
                avvik: avvik,
                measurements,
                measurementTypes
            }}>
            {children}
        </Context.Provider>
    );
};

interface ContextInterface {
    toggleModuleVisibilityState: (id: ReportModules) => void;

    infoText: OutputData | undefined;
    statementText: OutputData | undefined;
    setStatementText: React.Dispatch<
        React.SetStateAction<OutputData | undefined>
    >;
    reportSetting: ReportSetting | undefined;
    setReportSetting: React.Dispatch<
        React.SetStateAction<ReportSetting | undefined>
    >;
    isModuleActive: (reportModule: ReportModules) => boolean;

    kontroll: ReportKontroll | undefined;
    updateKontroll: (reportKontroll: ReportKontroll) => void;
    skjemaer: Skjema[] | undefined;
    filteredSkjemaer: Skjema[] | undefined;
    checklists: Checklist[] | undefined;
    setFilteredSkjemaer: React.Dispatch<
        React.SetStateAction<Skjema[] | undefined>
    >;

    avvik: Avvik[] | undefined;

    measurements: Measurement[] | undefined;
    measurementTypes: MeasurementType[] | undefined;
}
