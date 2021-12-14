import { AttachmentTable, columns, defaultColumns } from '../tables/attachment';
import { Card, CardContent, CardMenu } from '../components/card';
import { useEffect, useState } from 'react';

import { AttachmentModal } from '../modal/attachment';
import { AttachmentsViewParams } from '../contracts/navigation';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Kontroll } from '../contracts/kontrollApi';
import { TableContainer } from '../tables/tableContainer';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';

const AttachmentsView = () => {
    const { classes } = usePageStyles();
    const { kontrollId } = useParams<AttachmentsViewParams>();
    const [kontrollAddAttachmentId, setKontrollAddAttachmentId] = useState<
        number | undefined
    >();

    const [_kontroll, setKontroll] = useState<Kontroll>();

    const {
        state: { kontroller },
        loadKontroller
    } = useKontroll();

    useEffectOnce(() => {
        loadKontroller();
    });

    useEffect(() => {
        if (kontroller) {
            setKontroll(kontroller.find((k) => k.id === Number(kontrollId)));
        }
    }, [kontroller, kontrollId]);

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
                                            label: 'Ny måling',
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
                                        columns={columns()}
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
                kontrollId={kontrollAddAttachmentId}
                close={() => setKontrollAddAttachmentId(undefined)}
            />
        </div>
    );
};

export default AttachmentsView;
