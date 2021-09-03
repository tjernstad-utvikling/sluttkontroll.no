import { ActionType, Actions, TemplateState } from './contracts';

import _ from 'lodash';

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
                templates: _.unionBy(action.payload, state.templates, 'id')
            };

        default:
            throw new Error('unknown action');
    }
};
