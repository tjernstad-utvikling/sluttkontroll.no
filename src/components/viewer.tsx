import Grid from '@mui/material/Grid';
import { Viewer } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';

interface PdfViewerProps {
    getFileName: () => string;
    fileUrl: string | undefined;
}
export const PdfViewer = ({ getFileName, fileUrl }: PdfViewerProps) => {
    const getFilePluginInstance = getFilePlugin({
        fileNameGenerator: getFileName
    });
    const { DownloadButton } = getFilePluginInstance;
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
            {fileUrl !== undefined && (
                <Grid item xs={12} style={{ height: 1250 }}>
                    <div
                        className="rpv-core__viewer"
                        style={{
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                        <div
                            style={{
                                alignItems: 'right',
                                backgroundColor: '#eeeeee',
                                borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
                                display: 'flex',
                                padding: '4px'
                            }}>
                            <DownloadButton />
                        </div>
                        <div
                            style={{
                                flex: 1,
                                overflow: 'hidden'
                            }}>
                            <Viewer
                                fileUrl={fileUrl}
                                plugins={[getFilePluginInstance]}
                            />
                        </div>
                    </div>
                </Grid>
            )}
        </Worker>
    );
};
