import { AttachmentTable, columns, defaultColumns } from '../tables/attachment';
import { Card, CardContent, CardMenu } from '../components/card';

import { Attachment } from '../contracts/attachmentApi';
import { AttachmentModal } from '../modal/attachment';
import { AttachmentViewerModal } from '../modal/attachmentViewer';
import { AttachmentsViewParams } from '../contracts/navigation';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/tableContainer';
import { deleteAttachmentFile } from '../api/attachmentApi';
import { useConfirm } from '../hooks/useConfirm';
import { useKontrollById } from '../api/hooks/useKontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

const AttachmentsView = () => {
    const { classes } = usePageStyles();
    const { kontrollId } = useParams<AttachmentsViewParams>();
    const [kontrollAddAttachmentId, setKontrollAddAttachmentId] = useState<
        number | undefined
    >();
    const [kontrollViewAttachmentId, setKontrollViewAttachmentId] = useState<
        number | undefined
    >();

    const { confirm } = useConfirm();

    const { enqueueSnackbar } = useSnackbar();

    const kontrollData = useKontrollById(Number(kontrollId));

    const askToDeleteAttachment = async (attachmentId: number) => {
        if (kontrollData.data) {
            const attachment = kontrollData.data.attachments.find(
                (a) => a.id === attachmentId
            );
            const isConfirmed = await confirm(
                `Slette vedlegg ID: ${attachmentId} - ${attachment?.name}?`
            );

            if (isConfirmed) {
                const { status } = await deleteAttachmentFile(attachmentId);
                if (status === 204) {
                    enqueueSnackbar('Vedlegg er slettet', {
                        variant: 'success'
                    });
                    const attachments = kontrollData.data.attachments.filter(
                        (a) => a.id !== attachment?.id
                    );
                    throw new Error('Update not made');
                }
            }
        }
    };

    const addAttachments = (attachment: Attachment) => {
        if (kontrollData.data) {
            // updateKontroll({
            //     ...kontrollData.data,
            //     attachments: [...kontrollData.data.attachments, attachment]
            // });
            throw new Error('Update not made');
        }
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Vedlegg"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Nytt vedlegg',
                                            action: () =>
                                                setKontrollAddAttachmentId(
                                                    Number(kontrollId)
                                                )
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                <TableContainer
                                    columns={columns({
                                        onDelete: askToDeleteAttachment,
                                        openFile: (id) =>
                                            setKontrollViewAttachmentId(id)
                                    })}
                                    defaultColumns={defaultColumns}
                                    tableId="attachment">
                                    <AttachmentTable
                                        attachments={
                                            kontrollData.data?.attachments ?? []
                                        }
                                    />
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <AttachmentModal
                updateAttachmentList={addAttachments}
                kontrollId={kontrollAddAttachmentId}
                close={() => setKontrollAddAttachmentId(undefined)}
            />
            {kontrollData.data?.attachments && (
                <AttachmentViewerModal
                    attachmentId={kontrollViewAttachmentId}
                    close={() => setKontrollViewAttachmentId(undefined)}
                    attachments={kontrollData.data.attachments}
                />
            )}
        </div>
    );
};

export default AttachmentsView;
