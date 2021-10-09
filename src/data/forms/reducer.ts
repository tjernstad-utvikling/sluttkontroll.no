import { ActionType, Actions, State } from './contracts';

import _ from 'lodash';

export const initialState: State = {
    templates: undefined,
    groups: undefined
};

export const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case ActionType.addTemplates:
            return {
                ...state,
                templates: _.unionBy(action.payload, state.templates, 'id')
            };

        case ActionType.updateTemplate:
            return {
                ...state,
                templates: state.templates?.map((t) => {
                    if (t.id === action.payload.id) {
                        return action.payload;
                    } else {
                        return t;
                    }
                })
            };
        case ActionType.removeTemplate:
            return {
                ...state,
                templates: state.templates?.filter(
                    (t) => t.id !== action.payload.id
                )
            };
        default:
            throw new Error('unknown action');
    }
};
