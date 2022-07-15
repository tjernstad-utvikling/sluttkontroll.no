export interface Checkpoint {
    id: number;
    mainCategory: string;
    groupCategory: number;
    checkpointNumber: number;
    prosedyreNr: string;
    prosedyre: string;
    tiltak: string | null;
    tekst: string;
    gruppe: string;
}
