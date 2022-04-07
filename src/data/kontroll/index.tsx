import React, { createContext, useContext } from 'react';

import { ContextInterface } from './contracts';
import { useState } from 'react';

export const useKontroll = () => {
    return useContext(KontrollContext);
};

const KontrollContext = createContext<ContextInterface>({} as ContextInterface);

export const KontrollContextProvider = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [showAllKontroller, setShowAllKontroller] = useState<boolean>(false);

    return (
        <KontrollContext.Provider
            value={{
                showAllKontroller,
                setShowAllKontroller
            }}>
            {children}
        </KontrollContext.Provider>
    );
};
