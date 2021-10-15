import { FormsGroup, FormsTemplate } from '../contracts/sjaApi';
import { createContext, useContext, useState } from 'react';

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useCreateForm = () => {
    return useContext(Context);
};

export const CreateFormsContainer = ({
    children
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [createdTemplate, setCreatedTemplate] = useState<FormsTemplate>();
    const [selectedGroup, setSelectedGroup] = useState<FormsGroup>();

    const [activeStep, setActiveStep] = useState<number>(0);
    return (
        <Context.Provider
            value={{
                activeStep,
                setActiveStep,

                selectedGroup,
                setSelectedGroup,

                createdTemplate,
                setCreatedTemplate
            }}>
            {children}
        </Context.Provider>
    );
};

interface ContextInterface {
    activeStep: number;
    setActiveStep: (step: number) => void;

    selectedGroup: FormsGroup | undefined;
    setSelectedGroup: (group: FormsGroup) => void;

    createdTemplate: FormsTemplate | undefined;
    setCreatedTemplate: (template: FormsTemplate) => void;
}
