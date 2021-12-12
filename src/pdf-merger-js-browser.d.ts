declare module 'pdf-merger-js/browser' {
    class PDFMerger {
        constructor();
        add(
            inputFile: string | ArrayBuffer | Blob | Buffer | File,
            pages?: string | string[] | undefined | null
        ): Promise<undefined>;
        save(fileName: string): Promise<undefined>;
        saveAsBuffer(): Promise<Buffer>;
        saveAsBlob(): Promise<Blob>;
    }

    export = PDFMerger;
}
