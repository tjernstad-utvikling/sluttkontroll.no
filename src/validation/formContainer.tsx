import { createContext, useContext, useState } from 'react';

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useValidation = () => {
    return useContext(Context);
};

interface ValidatorFormProps {
    children: React.ReactNode;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    className: string | undefined;
}
export const ValidatorForm = ({
    children,
    onSubmit,
    className
}: ValidatorFormProps): JSX.Element => {
    const [inputState, setInputState] = useState<Array<InputState>>([]);

    const setInput = (input: InputState) => {
        if (inputState.find((i) => i.key === input.key) !== undefined) {
            setInputState((prevState) =>
                prevState.map((i) => (i.key === input.key ? input : i))
            );
        } else {
            setInputState((prevState) => [...prevState, input]);
        }
    };

    return (
        <Context.Provider
            value={{
                setInput
            }}>
            <form onSubmit={onSubmit} className={className}>
                {children}
            </form>
        </Context.Provider>
    );
};

interface ContextInterface {
    setInput: (input: InputState) => void;
}

interface InputState {
    key: string;
    status: boolean;
}
