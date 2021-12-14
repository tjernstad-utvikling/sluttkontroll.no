import { AttachmentTable, columns, defaultColumns } from '../tables/attachment';
import { Card, CardContent, CardMenu } from '../components/card';
import { useEffect, useState } from 'react';

import { Attachment } from '../contracts/attachmentApi';
import { AttachmentModal } from '../modal/attachment';
import { AttachmentsViewParams } from '../contracts/navigation';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Kontroll } from '../contracts/kontrollApi';
import { TableContainer } from '../tables/tableContainer';
import { deleteAttachmentFile } from '../api/attachmentApi';
import { useConfirm } from '../hooks/useConfirm';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const AttachmentsView = () => {
    const { classes } = usePageStyles();
    const { kontrollId } = useParams<AttachmentsViewParams>();
    const [kontrollAddAttachmentId, setKontrollAddAttachmentId] = useState<
        number | undefined
    >();

    const [_kontroll, setKontroll] = useState<Kontroll>();

    const { confirm } = useConfirm();

    const { enqueueSnackbar } = useSnackbar();

    const {
        state: { kontroller },
        loadKontroller,
        updateKontroll
    } = useKontroll();

    useEffectOnce(() => {
        loadKontroller();
    });

    useEffect(() => {
        if (kontroller) {
            setKontroll(kontroller.find((k) => k.id === Number(kontrollId)));
        }
    }, [kontroller, kontrollId]);

    const askToDeleteAttachment = async (attachmentId: number) => {
        if (_kontroll) {
            const attachment = _kontroll.attachments.find(
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
                    const attachments = _kontroll.attachments.filter(
                        (a) => a.id !== attachment?.id
                    );
                    updateKontroll({ ..._kontroll, attachments });
                }
            }
        }
    };

    const addAttachments = (attachment: Attachment) => {
        if (_kontroll) {
            updateKontroll({
                ..._kontroll,
                attachments: [..._kontroll.attachments, attachment]
            });
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
                                {_kontroll !== undefined ? (
                                    <TableContainer
                                        columns={columns({
                                            onDelete: askToDeleteAttachment
                                        })}
                                        defaultColumns={defaultColumns}
                                        tableId="attachment">
                                        <AttachmentTable
                                            attachments={_kontroll.attachments}
                                        />
                                    </TableContainer>
                                ) : (
                                    <div>Laster ...</div>
                                )}
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
        </div>
    );
};

export default AttachmentsView;
