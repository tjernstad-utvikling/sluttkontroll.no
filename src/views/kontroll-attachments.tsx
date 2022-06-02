import { AttachmentTable, columns, defaultColumns } from '../tables/attachment';
import { Card, CardContent, CardMenu } from '../components/card';
import {
    useAttachments,
    useDeleteAttachment
} from '../api/hooks/useAttachments';

import { AttachmentModal } from '../modal/attachment';
import { AttachmentViewerModal } from '../modal/attachmentViewer';
import { AttachmentsViewParams } from '../contracts/navigation';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { TableContainer } from '../tables/base/tableContainer';
import { useConfirm } from '../hooks/useConfirm';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';
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

    const attachmentsData = useAttachments({ kontrollId: Number(kontrollId) });

    const deleteAttachmentMutation = useDeleteAttachment();

    const askToDeleteAttachment = async (attachmentId: number) => {
        if (attachmentsData.data) {
            const attachment = attachmentsData.data.find(
                (a) => a.id === attachmentId
            );
            const isConfirmed = await confirm(
                `Slette vedlegg ID: ${attachmentId} - ${attachment?.name}?`
            );

            if (isConfirmed) {
                try {
                    await deleteAttachmentMutation.mutateAsync({
                        attachmentId,
                        kontrollId: Number(kontrollId)
                    });
                } catch (error) {
                    console.log(error);
                }
            }
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
                                        attachments={attachmentsData.data ?? []}
                                    />
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <AttachmentModal
                kontrollId={kontrollAddAttachmentId}
                close={() => setKontrollAddAttachmentId(undefined)}
            />
            {attachmentsData.data && (
                <AttachmentViewerModal
                    attachmentId={kontrollViewAttachmentId}
                    close={() => setKontrollViewAttachmentId(undefined)}
                    attachments={attachmentsData.data}
                />
            )}
        </div>
    );
};

export default AttachmentsView;
