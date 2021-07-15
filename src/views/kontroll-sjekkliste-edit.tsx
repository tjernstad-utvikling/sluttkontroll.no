import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Card } from '../components/card';
import { Checklist } from '../contracts/kontrollApi';
import { Checkpoint } from '../contracts/checkpointApi';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { LoadingButton } from '../components/button';
import { SjekklisterViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { getCheckpoints } from '../api/checkpointApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';

const SjekklisteEditView = () => {
    const classes = usePageStyles();

    const { skjemaId } = useParams<SjekklisterViewParams>();
    const history = useHistory();

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [selected, setSelected] = useState<Checkpoint[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [_checklists, setChecklists] = useState<Array<Checklist>>([]);

    const {
        state: { checklists },
        loadKontroller,
        saveEditChecklist
    } = useKontroll();

    useEffectOnce(() => {
        loadKontroller();
    });

    const onSubmitChecklist = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);
        if (await saveEditChecklist(Number(skjemaId), selected)) {
            history.goBack();
        }
        setIsSubmitting(false);
    };

    useEffect(() => {
        if (checklists !== undefined) {
            setChecklists(
                checklists.filter((c) => c.skjema.id === Number(skjemaId))
            );
        }
    }, [checklists, skjemaId]);

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
        } catch (error) {}
    });

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Endre sjekkpunkter">
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
                                {checkpoints !== undefined ? (
                                    <TableContainer
                                        columns={columns('')}
                                        defaultColumns={defaultColumns}
                                        tableId="checkpoints">
                                        <CheckpointTable
                                            checklists={_checklists}
                                            skjemaId={Number(skjemaId)}
                                            checkpoints={checkpoints}
                                            onSelected={(checkpoints) =>
                                                setSelected(checkpoints)
                                            }
                                        />
                                    </TableContainer>
                                ) : (
                                    <div>Laster sjekkpunkter</div>
                                )}
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default SjekklisteEditView;
