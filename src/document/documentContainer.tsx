import { Checklist, ReportKontroll, Skjema } from '../contracts/kontrollApi';
import { Measurement, MeasurementType } from '../contracts/measurementApi';
import { createContext, useContext, useState } from 'react';

import { Avvik } from '../contracts/avvikApi';
import { format } from 'date-fns';
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
    reportTypeId,
    kontrollId,
    objectId
}: {
    children: React.ReactNode;
    reportTypeId: string;
    kontrollId: number;
    objectId: number;
}): JSX.Element => {
    const [visibleReportModules, setVisibleReportModules] = useState<
        ReportModules[]
    >([]);
    const [_kontroll, setKontroll] = useState<ReportKontroll>();
    const [frontPageData, setFrontPageData] = useState<FrontPageData>();
    const [_infoText, setInfoText] = useState<string>();

    const {
        state: { skjemaer, checklists },
        loadKontrollerByObjekt
    } = useKontroll();
    const [_skjemaer, setSkjemaer] = useState<Array<Skjema>>();
    const [filteredSkjemaer, setFilteredSkjemaer] = useState<Array<Skjema>>();

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
        const { infoText } = await getInfoText();
        setInfoText(infoText);
        setKontroll(kontroll);

        loadKontrollerByObjekt(objectId);
        loadAvvikByKontroller([kontroll]);
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

    return (
        <Context.Provider
            value={{
                visibleReportModules,
                toggleModuleVisibilityState,
                frontPageData,
                setFrontPageData,
                infoText: _infoText,
                kontroll: _kontroll,
                skjemaer: _skjemaer,
                filteredSkjemaer,
                setFilteredSkjemaer,
                checklists,
                avvik,
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

    infoText: string | undefined;

    kontroll: ReportKontroll | undefined;
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

export enum ReportModules {
    frontPage = 'FrontPage',
    infoPage = 'InfoPage',
    controlModule = 'controlModule',
    skjemaPage = 'skjemaPage',
    measurementPage = 'measurementPage',
    inlineMeasurementModule = 'inlineMeasurementModule'
}

export interface FrontPageData {
    date: string;
    title: string;
    user: string;
    kontrollsted: string;
}
