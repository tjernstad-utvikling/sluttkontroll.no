import {
    FormsField,
    FormsFieldTypeEnum,
    FormsGroup,
    FormsObjectChoice,
    FormsTemplate
} from '../../contracts/sjaApi';

export interface State {
    templates: FormsTemplate[] | undefined;
    groups: FormsGroup[] | undefined;
    fields: FormsField[] | undefined;
}

export enum ActionType {
    addTemplates,
    addGroups,
    addFields
}

export interface addTemplates {
    type: ActionType.addTemplates;
    payload: FormsTemplate[];
}

export interface addGroups {
    type: ActionType.addGroups;
    payload: FormsGroup[];
}

export interface addFields {
    type: ActionType.addFields;
    payload: FormsField[];
}

export type Actions = addTemplates | addGroups | addFields;

export interface ContextInterface {
    state: State;
    newTemplate: (
        title: string,
        subTitle: string,
        description: string
    ) => Promise<FormsTemplate | false>;
    editTemplate: (template: FormsTemplate) => Promise<FormsTemplate | false>;
    setIdentification: (
        template: FormsTemplate,
        fieldId: number
    ) => Promise<FormsTemplate | false>;
    newTemplateGroup: (
        title: string,
        description: string,
        templateId: number
    ) => Promise<boolean>;
    editTemplateGroup: (group: FormsGroup) => Promise<boolean>;
    sortGroup: (
        groups: FormsGroup[],
        startIndex: number,
        endIndex: number
    ) => Promise<boolean>;
    newTemplateField: (
        title: string,
        type: FormsFieldTypeEnum,
        textChoices: string[] | undefined,
        objectChoices: FormsObjectChoice[] | undefined,
        objectTitle: string | undefined,
        sortingIndex: number,
        groupId: number
    ) => Promise<boolean>;
    editTemplateField: (field: FormsField) => Promise<boolean>;
    sortFields: (
        _fields: FormsField[],
        startIndex: number,
        endIndex: number
    ) => Promise<boolean>;
}
