import { FormsField, FormsGroup, FormsTemplate } from '../contracts/formsApi';
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
    const [selectedField, setSelectedField] = useState<FormsField>();

    const [activeStep, setActiveStep] = useState<number>(0);
    return (
        <Context.Provider
            value={{
                activeStep,
                setActiveStep,

                selectedField,
                setSelectedField,

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
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;

    selectedField: FormsField | undefined;
    setSelectedField: (field: FormsField | undefined) => void;

    selectedGroup: FormsGroup | undefined;
    setSelectedGroup: (group: FormsGroup | undefined) => void;

    createdTemplate: FormsTemplate | undefined;
    setCreatedTemplate: (template: FormsTemplate) => void;
}
