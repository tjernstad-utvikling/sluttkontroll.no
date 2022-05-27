import { Card, CardContent } from '../components/card';
import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';
import { useChecklists, useUpdateChecklist } from '../api/hooks/useChecklist';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Checkpoint } from '../contracts/checkpointApi';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { LoadingButton } from '../components/button';
import { SelectTemplate } from '../components/template';
import { SjekklisterViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/base/tableContainer';
import { Template } from '../contracts/skjemaTemplateApi';
import { useCheckpoints } from '../api/hooks/useCheckpoint';
import { usePageStyles } from '../styles/kontroll/page';

const SjekklisteEditView = () => {
    const { classes } = usePageStyles();

    const { skjemaId } = useParams<SjekklisterViewParams>();
    const history = useHistory();

    const [selected, setSelected] = useState<Checkpoint[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [template, setTemplate] = useState<Template>();

    const [selectFromTemplate, setSelectFromTemplate] =
        useState<boolean>(false);

    const checklistData = useChecklists({
        skjemaId: Number(skjemaId)
    });

    const checklistMutations = useUpdateChecklist();

    const checkpointData = useCheckpoints();

    const onSubmitChecklist = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            await checklistMutations.mutateAsync({
                checkpoints: selected,
                skjemaId: Number(skjemaId)
            });
        } catch (error) {
            console.log(error);
        } finally {
            history.goBack();
        }

        setIsSubmitting(false);
    };

    useEffect(() => {
        setSelected(checklistData.data?.map((c) => c.checkpoint) ?? []);
    }, [checklistData.data]);

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Endre sjekkpunkter">
                            <CardContent>
                                <form onSubmit={onSubmitChecklist}>
                                    <LoadingButton
                                        isLoading={isSubmitting}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary">
                                        Lagre{' '}
                                        {selected !== undefined
                                            ? `(Sjekkpunkter: ${selected.length} ) `
                                            : ''}
                                    </LoadingButton>
                                    <SelectTemplate
                                        onSelect={(template) => {
                                            setSelectFromTemplate(false);
                                            setTemplate(template);
                                            setSelected(
                                                template.skjemaTemplateCheckpoints.map(
                                                    (stc) => stc.checkpoint
                                                )
                                            );
                                        }}
                                        onOpen={() => {
                                            setSelectFromTemplate(
                                                !selectFromTemplate
                                            );
                                        }}
                                        isOpen={selectFromTemplate}
                                    />
                                    {!selectFromTemplate ? (
                                        <TableContainer
                                            columns={columns({})}
                                            defaultColumns={defaultColumns}
                                            tableId="checkpoints">
                                            <CheckpointTable
                                                isLoading={
                                                    checkpointData.isLoading ||
                                                    checklistData.isLoading
                                                }
                                                checklists={checklistData.data}
                                                templateList={
                                                    template?.skjemaTemplateCheckpoints
                                                }
                                                checkpoints={
                                                    checkpointData.data ?? []
                                                }
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
                                    ) : (
                                        <div />
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default SjekklisteEditView;
