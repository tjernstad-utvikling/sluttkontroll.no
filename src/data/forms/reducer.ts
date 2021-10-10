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
        case ActionType.addGroups:
            return {
                ...state,
                groups: _.unionBy(action.payload, state.groups, 'id')
            };

        default:
            throw new Error('unknown action');
    }
};
