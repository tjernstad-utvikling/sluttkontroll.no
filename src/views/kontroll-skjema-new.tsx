import { Card, CardContent } from '../components/card';
import { useHistory, useParams } from 'react-router-dom';

import { Checkpoint } from '../contracts/checkpointApi';
import { CheckpointTable } from '../tables/checkpoint';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { SelectTemplate } from '../components/template';
import { SkjemaSchema } from '../schema/skjema';
import { SkjemaerViewParams } from '../contracts/navigation';
import { Template } from '../contracts/skjemaTemplateApi';
import { useCheckpoints } from '../api/hooks/useCheckpoint';
import { useNewSkjema } from '../api/hooks/useSkjema';
import { usePageStyles } from '../styles/kontroll/page';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

const SkjemaNewView = () => {
    const { classes } = usePageStyles();

    const { kontrollId } = useParams<SkjemaerViewParams>();
    const history = useHistory();

    const [selected, setSelected] = useState<Checkpoint[]>([]);
    const [template, setTemplate] = useState<Template>();

    const [selectFromTemplate, setSelectFromTemplate] =
        useState<boolean>(false);

    const newSkjemaMutation = useNewSkjema();

    const { enqueueSnackbar } = useSnackbar();

    const checkpointData = useCheckpoints();

    const onSaveSkjema = async (
        omrade: string,
        area: string
    ): Promise<boolean> => {
        try {
            await newSkjemaMutation.mutateAsync({
                area,
                omrade,
                kontrollId: Number(kontrollId),
                checkpointIds: selected.map((c) => c.id)
            });
        } catch (error) {
            enqueueSnackbar('Problemer med lagring av skjema', {
                variant: 'error'
            });
            return false;
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
                        <Card title="Nytt skjema">
                            <CardContent>
                                <SkjemaSchema
                                    onSubmit={onSaveSkjema}
                                    checkpointCount={selected.length}
                                />

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
                                    <CheckpointTable
                                        isLoading={checkpointData.isLoading}
                                        templateList={
                                            template?.skjemaTemplateCheckpoints ||
                                            []
                                        }
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
                                ) : (
                                    <div />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SkjemaNewView;
