export interface Forms {
    id: number;
    sjaFormFields: FormsField[];
    template: FormsTemplate;
    user: { id: string; name: string };
}

export interface FormsField {
    date: Date;
    id: number;
    text: string;
}
export interface FormsTemplate {
    id: number;
    title: string;
    subTitle: string;
    description: string;
    listIdentificationField: { id: number };
}

export interface FormsGroup {
    id: number;
    title?: string;
    description?: string;
    sortingIndex: number;
    showGroupTitle: boolean;
    template: FormsTemplate;
}

export interface FormsField {
    id: number;
    title: string;
    type: FormsFieldTypeEnum;
    textChoices?: string[];
    objectChoices?: FormsObjectChoice[];
    objectTitle?: string;
    sortingIndex: number;
    sjaGroup: FormsGroup;
}

export enum FormsFieldTypeEnum {
    info = 'info',
    preDef = 'preDef',
    preDefObj = 'preDefObj',
    check = 'check',
    signature = 'signature'
}

export interface FormsObjectChoice {
    id: number;
    title: string;
    text: string;
}

export interface SjaFormStateType {
    id: number;
    templateId: number;
    fields?: Array<FieldStateType>;
}

export interface FieldStateType {
    id: number;
    text: string;
    checkmark: boolean;
    objectChoice: string;
    fieldId: number | undefined;
    groupId: number | undefined;
    comment: string;
    sjaFormId: number;
    date: string;
}

export interface dbTemplateType {
    stID: number;
    template_json: string;
}

export interface UploadResponse {
    status: number;
    returnFields: Array<number>;
    returnForms: Array<number>;
}
