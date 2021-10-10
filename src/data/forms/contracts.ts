import { FormsGroup, FormsTemplate } from '../../contracts/sjaApi';

export interface State {
    templates: FormsTemplate[] | undefined;
    groups: FormsGroup[] | undefined;
}

export enum ActionType {
    addTemplates,
    addGroups
}

export interface addTemplates {
    type: ActionType.addTemplates;
    payload: FormsTemplate[];
}
export interface addGroups {
    type: ActionType.addGroups;
    payload: FormsGroup[];
}

export type Actions = addTemplates | addGroups;

export interface ContextInterface {
    state: State;
    newTemplate: (
        title: string,
        subTitle: string,
        description: string
    ) => Promise<FormsTemplate | false>;
    newTemplateGroup: (
        title: string,
        description: string,
        templateId: number
    ) => Promise<boolean>;
    sortGroup: (
        groups: FormsGroup[],
        startIndex: number,
        endIndex: number
    ) => Promise<boolean>;
}
