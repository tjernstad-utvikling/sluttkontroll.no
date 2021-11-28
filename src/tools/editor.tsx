import EditorJS, { OutputData } from '@editorjs/editorjs';
import { Fragment, useEffect, useRef } from 'react';

import Header from '@editorjs/header';

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
}
export const Editor = ({ setContent, text }: EditorProps) => {
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
                header: Header
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
