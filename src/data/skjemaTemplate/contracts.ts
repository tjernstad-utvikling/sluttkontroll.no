import { Checkpoint } from '../../contracts/checkpointApi';
import { Template } from '../../contracts/skjemaTemplateApi';

export interface TemplateState {
    templates: Template[] | undefined;
}

export enum ActionType {
    addTemplates,
    updateTemplate,
    removeTemplate
}

export interface addTemplates {
    type: ActionType.addTemplates;
    payload: Template[];
}

export interface updateTemplate {
    type: ActionType.updateTemplate;
    payload: Template;
}

export interface removeTemplate {
    type: ActionType.removeTemplate;
    payload: Template;
}

export type Actions = addTemplates | updateTemplate | removeTemplate;

export interface ContextInterface {
    state: TemplateState;
    loadTemplates: () => Promise<void>;
    newTemplate: (name: string, checkpoints: Checkpoint[]) => Promise<boolean>;
    updateTemplate: (
        template: Template,
        selectedCheckpoints: Checkpoint[]
    ) => Promise<boolean>;
    removeTemplate: (template: Template) => Promise<boolean>;
}
