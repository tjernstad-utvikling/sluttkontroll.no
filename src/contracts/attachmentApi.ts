export interface Attachment {
    id: number;
    file: string;
    name: string;
    description?: string;
    kontroll: {
        id: number;
    };
}
