import { Checklist, ReportKontroll, Skjema } from '../contracts/kontrollApi';
import { Measurement, MeasurementType } from '../contracts/measurementApi';
import { OutputBlockData, OutputData } from '@editorjs/editorjs';
import { ReportModules, ReportSetting } from '../contracts/reportApi';
import { createContext, useContext, useState } from 'react';

import { Avvik } from '../contracts/avvikApi';
import { format } from 'date-fns';
import { getImageFile } from '../api/imageApi';
import { getInfoText } from '../api/settingsApi';
import { getKontrollReportData } from '../api/kontrollApi';
import { getReportSetting } from '../api/reportApi';
import { getReportStatement } from '../api/reportApi';
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
    const [visibleReportModules, setVisibleReportModules] = useState<
        ReportModules[]
    >([]);
    const [_kontroll, setKontroll] = useState<ReportKontroll>();
    const [reportSetting, setReportSetting] = useState<ReportSetting>();
    const [frontPageData, setFrontPageData] = useState<FrontPageData>();
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

    const {
        state: { users },
        loadUsers
    } = useUser();

    useEffectOnce(async () => {
        loadUsers();
        const { kontroll } = await getKontrollReportData(Number(kontrollId));

        setKontroll(kontroll);

        const res = await getReportSetting(Number(kontrollId));

        const { infoText } = await getInfoText();
        setInfoText(infoText);
        loadKontrollerByObjekt(objectId);
        loadAvvikByKontroller([kontroll]);

        const { status, rapportStatement: text } = await getReportStatement(
            Number(kontrollId)
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
            setStatementText(text);
        }
    });

    useEffect(() => {
        if (
            users !== undefined &&
            _kontroll !== undefined &&
            _kontroll.rapportEgenskaper !== null
        ) {
            const rapportEgenskaper = _kontroll.rapportEgenskaper;
            let userName = '';
            const rapportUser = rapportEgenskaper.rapportUser;
            if (rapportUser !== null) {
                const user = users.find((u) => u.id === rapportUser.id);
                if (user !== undefined) {
                    userName = user.name;
                }
            }

            if (_kontroll !== undefined) {
                let date = new Date();
                if (_kontroll.completedDate !== null) {
                    date = new Date(_kontroll.completedDate);
                }
                setFrontPageData({
                    date: format(date, 'dd.MM.yyyy'),
                    title: '3. Partskontroll',
                    user: userName,
                    kontrollsted: rapportEgenskaper.kontrollsted
                });
            }
        }
    }, [_kontroll, users]);

    useEffect(() => {
        if (skjemaer !== undefined) {
            setSkjemaer(skjemaer.filter((s) => s.kontroll.id === kontrollId));
            setFilteredSkjemaer(
                skjemaer.filter((s) => s.kontroll.id === kontrollId)
            );
        }
    }, [skjemaer, kontrollId]);

    const toggleModuleVisibilityState = (id: ReportModules) => {
        if (visibleReportModules.includes(id)) {
            setVisibleReportModules(
                visibleReportModules.filter((vrm) => vrm !== id)
            );
        } else {
            setVisibleReportModules([...visibleReportModules, id]);
        }
    };

    const updateKontroll = (reportKontroll: ReportKontroll) => {
        setKontroll(reportKontroll);
        const rapportEgenskaper = reportKontroll.rapportEgenskaper;
        let userName = '';
        if (rapportEgenskaper !== null && users !== undefined) {
            const rapportUser = rapportEgenskaper.rapportUser;
            if (rapportUser !== null) {
                const user = users.find((u) => u.id === rapportUser.id);
                if (user !== undefined) {
                    userName = user.name;
                }
            }

            if (_kontroll !== undefined) {
                let date = new Date();
                if (_kontroll.completedDate !== null) {
                    date = new Date(_kontroll.completedDate);
                }
                setFrontPageData({
                    date: format(date, 'dd.MM.yyyy'),
                    title: '3. Partskontroll',
                    user: userName,
                    kontrollsted: rapportEgenskaper.kontrollsted
                });
            }
        }
    };

    return (
        <Context.Provider
            value={{
                visibleReportModules,
                toggleModuleVisibilityState,
                frontPageData,
                setFrontPageData,
                infoText: _infoText,
                statementText: _statementText,

                kontroll: _kontroll,
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
    visibleReportModules: ReportModules[];
    toggleModuleVisibilityState: (id: ReportModules) => void;

    frontPageData: FrontPageData | undefined;
    setFrontPageData: React.Dispatch<
        React.SetStateAction<FrontPageData | undefined>
    >;

    infoText: OutputData | undefined;
    statementText: OutputData | undefined;

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

export interface FrontPageData {
    date: string;
    title: string;
    user: string;
    kontrollsted: string;
}
