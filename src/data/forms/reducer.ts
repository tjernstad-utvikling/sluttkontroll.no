import { ActionType, Actions, State } from './contracts';

import unionBy from 'lodash.unionby';

export const initialState: State = {
    templates: undefined,
    groups: undefined,
    fields: undefined
};

export const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case ActionType.addTemplates:
            return {
                ...state,
                templates: unionBy(action.payload, state.templates, 'id')
            };
        case ActionType.addGroups:
            return {
                ...state,
                groups: unionBy(action.payload, state.groups, 'id')
            };
        case ActionType.addFields:
            return {
                ...state,
                fields: unionBy(action.payload, state.fields, 'id')
            };

        default:
            throw new Error('unknown action');
    }
};
