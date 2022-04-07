import { AvvikActions, AvvikState } from './contracts';

export const initialState: AvvikState = {
    avvik: undefined
};

export const userReducer = (
    state: AvvikState,
    action: AvvikActions
): AvvikState => {
    switch (action.type) {
        default:
            throw new Error('unknown action');
    }
};
