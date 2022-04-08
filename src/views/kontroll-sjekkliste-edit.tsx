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
import { TableContainer } from '../tables/tableContainer';
import { Template } from '../contracts/skjemaTemplateApi';
import { getCheckpoints } from '../api/checkpointApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';

const SjekklisteEditView = () => {
    const { classes } = usePageStyles();

    const { skjemaId } = useParams<SjekklisterViewParams>();
    const history = useHistory();

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [selected, setSelected] = useState<Checkpoint[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [template, setTemplate] = useState<Template>();

    const [selectFromTemplate, setSelectFromTemplate] =
        useState<boolean>(false);

    const checklistData = useChecklists({
        skjemaId: Number(skjemaId)
    });

    const checklistMutations = useUpdateChecklist();

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

    useEffectOnce(async () => {
        try {
            const res = await getCheckpoints();
            if (res.status === 200) {
                setCheckpoints(
                    res.checkpoints.sort((a, b) =>
                        String(a.prosedyreNr).localeCompare(
                            String(b.prosedyreNr),
                            undefined,
                            { numeric: true, sensitivity: 'base' }
                        )
                    )
                );
            }
        } catch (error: any) {}
    });

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
                                        checkpoints !== undefined ? (
                                            <TableContainer
                                                columns={columns({})}
                                                defaultColumns={defaultColumns}
                                                tableId="checkpoints">
                                                <CheckpointTable
                                                    checklists={
                                                        checklistData.data
                                                    }
                                                    templateList={
                                                        template?.skjemaTemplateCheckpoints
                                                    }
                                                    checkpoints={checkpoints}
                                                    onSelected={(ids) =>
                                                        setSelected(
                                                            checkpoints?.filter(
                                                                (c) =>
                                                                    ids.indexOf(
                                                                        c.id
                                                                    ) !== -1
                                                            )
                                                        )
                                                    }
                                                />
                                            </TableContainer>
                                        ) : (
                                            <div>Laster sjekkpunkter</div>
                                        )
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
