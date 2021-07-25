import { createContext, useContext, useState } from 'react';

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useReport = () => {
    return useContext(Context);
};

export const DocumentContainer = ({
    children,
    reportTypeId
}: {
    children: React.ReactNode;
    reportTypeId: string;
}): JSX.Element => {
    const [visibleReportModules, setVisibleReportModules] = useState<
        ReportModules[]
    >([]);
    const [frontPageData, setFrontPageData] = useState<FrontPageData>();

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
                frontPageData
            }}>
            {children}
        </Context.Provider>
    );
};

interface ContextInterface {
    visibleReportModules: ReportModules[];
    toggleModuleVisibilityState: (id: ReportModules) => void;
    frontPageData: FrontPageData | undefined;
}

export enum ReportModules {
    frontPage = 'FrontPage'
}

export interface FrontPageData {
    date: string;
    title: string;
    user: string;
}
