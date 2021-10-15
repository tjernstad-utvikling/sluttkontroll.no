export interface FormsTemplate {
    id: number;
    title: string;
    subTitle: string;
    description: string;
}

export interface FormsGroup {
    id: number;
    title?: string;
    description?: string;
    sortingIndex: number;
    template: FormsTemplate;
}

export interface FormsField {
    id: number;
    title: string;
    type: FormsFieldTypeEnum;
    textChoices?: string[];
    objectChoices?: ObjectChoiceType[];
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

export interface Option {
    value: FormsFieldTypeEnum;
    label: string;
}

export const formsFieldTypeOption: Option[] = [
    {
        value: FormsFieldTypeEnum.info,
        label: 'Info felt'
    },
    {
        value: FormsFieldTypeEnum.check,
        label: 'Ja/Nei med kommentar'
    },
    {
        value: FormsFieldTypeEnum.preDef,
        label: 'Predefinerte tekster'
    },
    {
        value: FormsFieldTypeEnum.preDefObj,
        label: 'Predefinerte valg med tilhørende tekst'
    },
    {
        value: FormsFieldTypeEnum.signature,
        label: 'Signatur'
    }
];

export interface ObjectChoiceType {
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
