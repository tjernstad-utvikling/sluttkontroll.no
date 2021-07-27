import { createContext, useContext, useState } from 'react';

import { ReportKontroll } from '../contracts/kontrollApi';
import { getKontrollReportData } from '../api/kontrollApi';
import { useEffect } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useUser } from '../data/user';

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useReport = () => {
    return useContext(Context);
};

export const DocumentContainer = ({
    children,
    reportTypeId,
    kontrollId
}: {
    children: React.ReactNode;
    reportTypeId: string;
    kontrollId: number;
}): JSX.Element => {
    const [visibleReportModules, setVisibleReportModules] = useState<
        ReportModules[]
    >([]);
    const [_kontroll, setKontroll] = useState<ReportKontroll>();
    const [frontPageData, setFrontPageData] = useState<FrontPageData>();

    const {
        state: { users },
        loadUsers
    } = useUser();

    useEffectOnce(async () => {
        loadUsers();
        const { kontroll } = await getKontrollReportData(Number(kontrollId));
        setKontroll(kontroll);
    });

    useEffect(() => {
        if (users !== undefined) {
            const user = users.find((u) => u.id === _kontroll?.user.id);

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
                setFrontPageData
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
}

export enum ReportModules {
    frontPage = 'FrontPage',
    infoPage = 'InfoPage'
}

export interface FrontPageData {
    date: string;
    title: string;
    user: string;
    kontrollsted: string;
}
