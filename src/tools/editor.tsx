import EditorJS, { OutputData } from '@editorjs/editorjs';
import { Fragment, useEffect, useRef } from 'react';

import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';

const EDITOR_HOLDER_ID = 'editorjs';

const DEFAULT: OutputData = {
    time: new Date().getTime(),
    blocks: [
        {
            type: 'header',
            data: {
                text: 'Skriv inn tekst til rapporten her',
                level: 1
            }
        }
    ]
};

interface EditorProps {
    setContent: (content: OutputData | undefined) => void;
    text: OutputData | undefined;
    uploadImage: (file: File) => Promise<{
        success: boolean;
        file: { url: string; id: number };
    }>;
}
export const Editor = ({ setContent, text, uploadImage }: EditorProps) => {
    const ejInstance = useRef<EditorJS | null>(null);
    // This will run only once
    useEffect(() => {
        if (!ejInstance.current) {
            initEditor();
        }
        return () => {
            ejInstance?.current?.destroy();
            ejInstance.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initEditor = () => {
        const editor = new EditorJS({
            holder: EDITOR_HOLDER_ID,
            logLevel: undefined,
            data: text || DEFAULT,
            onReady: () => {
                ejInstance.current = editor;
            },
            onChange: () => {
                save();
            },
            autofocus: true,
            tools: {
                header: Header,
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            /**
                             * Upload file to the server and return an uploaded image data
                             * @param {File} file - file selected from the device or pasted by drag-n-drop
                             * @return {Promise.<{success, file: {url}}>}
                             */
                            async uploadByFile(file: File): Promise<{
                                success: boolean;
                                file: { url: string };
                            }> {
                                return await uploadImage(file);
                            }
                        }
                    }
                }
            }
        });
    };

    async function save() {
        setContent(await ejInstance.current?.saver.save());
    }

    return (
        <Fragment>
            <div id={EDITOR_HOLDER_ID}> </div>
        </Fragment>
    );
};
