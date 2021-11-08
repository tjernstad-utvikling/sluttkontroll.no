import { ActionType, Actions, TemplateState } from './contracts';

import unionBy from 'lodash.unionby';

export const initialState: TemplateState = {
    templates: undefined
};

export const reducer = (
    state: TemplateState,
    action: Actions
): TemplateState => {
    switch (action.type) {
        case ActionType.addTemplates:
            return {
                ...state,
                templates: unionBy(action.payload, state.templates, 'id')
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
