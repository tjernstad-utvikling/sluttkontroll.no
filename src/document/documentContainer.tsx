import { Checklist, ReportKontroll, Skjema } from '../contracts/kontrollApi';
import { createContext, useContext, useState } from 'react';

import { Avvik } from '../contracts/avvikApi';
import { getInfoText } from '../api/settingsApi';
import { getKontrollReportData } from '../api/kontrollApi';
import { useAvvik } from '../data/avvik';
import { useEffect } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
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

    const {
        state: { avvik },
        loadAvvikByKontroller
    } = useAvvik();

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
        if (users !== undefined) {
            const user = users.find(
                (u) => u.id === _kontroll?.rapportEgenskaper.rapportUser.id
            );

            if (user !== undefined && _kontroll !== undefined) {
                setFrontPageData({
                    date: '25.07.2021',
                    title: '3. Partskontroll',
                    user: user.name,
                    kontrollsted: _kontroll.rapportEgenskaper.kontrollsted
                });
            }
        }
    }, [_kontroll, users]);

    useEffect(() => {
        if (skjemaer !== undefined) {
            setSkjemaer(skjemaer.filter((s) => s.kontroll.id === kontrollId));
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
                checklists,
                avvik
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
    checklists: Checklist[] | undefined;

    avvik: Avvik[] | undefined;
}

export enum ReportModules {
    frontPage = 'FrontPage',
    infoPage = 'InfoPage',
    skjemaPage = 'skjemaPage'
}

export interface FrontPageData {
    date: string;
    title: string;
    user: string;
    kontrollsted: string;
}
