import { FormsGroup, FormsTemplate } from '../../contracts/sjaApi';

export interface State {
    templates: FormsTemplate[] | undefined;
    groups: FormsGroup[] | undefined;
}

export enum ActionType {
    addTemplates,
    updateTemplate,
    removeTemplate
}

export interface addTemplates {
    type: ActionType.addTemplates;
    payload: FormsTemplate[];
}

export interface updateTemplate {
    type: ActionType.updateTemplate;
    payload: FormsTemplate;
}

export interface removeTemplate {
    type: ActionType.removeTemplate;
    payload: FormsTemplate;
}

export type Actions = addTemplates | updateTemplate | removeTemplate;

export interface ContextInterface {
    state: State;
    loadTemplates: () => Promise<void>;
}
