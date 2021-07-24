import { createContext, useContext, useMemo, useState } from 'react';

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
    const [visibleReportModules, setVisibleReportModules] = useState<string[]>(
        []
    );

    const toggleModuleVisibilityState = (id: string) => {
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
            value={{ visibleReportModules, toggleModuleVisibilityState }}>
            {children}
        </Context.Provider>
    );
};

interface ContextInterface {
    visibleReportModules: string[];
    toggleModuleVisibilityState: (id: string) => void;
}
