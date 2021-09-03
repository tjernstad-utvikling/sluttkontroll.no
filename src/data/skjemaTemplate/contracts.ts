import { Checkpoint } from '../../contracts/checkpointApi';
import { Template } from '../../contracts/skjemaTemplateApi';

export interface TemplateState {
    templates: Template[] | undefined;
}

export enum ActionType {
    addTemplates
}

export interface addTemplates {
    type: ActionType.addTemplates;
    payload: Template[];
}

export type Actions = addTemplates;

export interface ContextInterface {
    state: TemplateState;
    loadTemplates: () => Promise<void>;
    newTemplate: (name: string, checkpoints: Checkpoint[]) => Promise<boolean>;
}
