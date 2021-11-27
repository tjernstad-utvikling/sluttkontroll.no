import EditorJS, { OutputData } from '@editorjs/editorjs';
import { Fragment, useEffect, useRef } from 'react';

import Header from '@editorjs/header';

const EDITOR_HOLDER_ID = 'editorjs';

export const Editor = () => {
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
    }, []);

    const initEditor = () => {
        const editor = new EditorJS({
            holder: EDITOR_HOLDER_ID,
            logLevel: undefined,
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
        console.log(await ejInstance.current?.saver.save());
    }

    return (
        <Fragment>
            <div id={EDITOR_HOLDER_ID}> </div>
        </Fragment>
    );
};
