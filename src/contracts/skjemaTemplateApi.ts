import { Checkpoint } from './checkpointApi';

export interface Template {
    id: number;
    name: string;
    skjemaTemplateCheckpoints: SkjemaTemplateCheckpoint[];
}

export interface SkjemaTemplateCheckpoint {
    id: number;
    checkpoint: Checkpoint;
}
