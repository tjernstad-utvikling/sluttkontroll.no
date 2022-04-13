import { Card, CardContent } from '../components/card';
import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';

import { Checkpoint } from '../contracts/checkpointApi';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { SkjemaTemplateSchema } from '../schema/skjemaTemplate';
import { TableContainer } from '../tables/tableContainer';
import { useCheckpoints } from '../api/hooks/useCheckpoint';
import { useHistory } from 'react-router-dom';
import { useNewTemplate } from '../api/hooks/useSkjemaTemplate';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const SkjemaTemplateNewView = () => {
    const { classes } = usePageStyles();

    const history = useHistory();

    const [selected, setSelected] = useState<Checkpoint[]>([]);

    const checkpointData = useCheckpoints();

    const newTemplateMutation = useNewTemplate();

    const onSaveTemplate = async (name: string): Promise<boolean> => {
        try {
            newTemplateMutation.mutateAsync({
                checkpointIds: selected.map((s) => s.id),
                name
            });
        } catch (error) {
            console.log(error);
        } finally {
            history.goBack();
            return true;
        }
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny sjekklistemal">
                            <CardContent>
                                <SkjemaTemplateSchema
                                    onSubmit={onSaveTemplate}
                                    checkpointCount={selected.length}
                                />

                                <TableContainer
                                    columns={columns({})}
                                    defaultColumns={defaultColumns}
                                    tableId="checkpoints">
                                    <CheckpointTable
                                        isLoading={checkpointData.isLoading}
                                        checkpoints={checkpointData.data ?? []}
                                        onSelected={(ids) =>
                                            setSelected(
                                                checkpointData.data
                                                    ? checkpointData.data?.filter(
                                                          (c) =>
                                                              ids.indexOf(
                                                                  c.id
                                                              ) !== -1
                                                      )
                                                    : []
                                            )
                                        }
                                    />
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SkjemaTemplateNewView;
