import { Card, CardContent } from '../components/card';
import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';

import { Checkpoint } from '../contracts/checkpointApi';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { SkjemaTemplateSchema } from '../schema/skjemaTemplate';
import { TableContainer } from '../tables/tableContainer';
import { getCheckpoints } from '../api/checkpointApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useHistory } from 'react-router-dom';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';
import { useTemplate } from '../data/skjemaTemplate';

const SkjemaTemplateNewView = () => {
    const { classes } = usePageStyles();

    const history = useHistory();

    const { newTemplate } = useTemplate();

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
    const [selected, setSelected] = useState<Checkpoint[]>([]);

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
        } catch (error: any) {
            console.error(error);
        }
    });

    const onSaveTemplate = async (name: string): Promise<boolean> => {
        if (await newTemplate(name, selected)) {
            history.goBack();
            return true;
        }
        return false;
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

                                {checkpoints !== undefined ? (
                                    <TableContainer
                                        columns={columns({})}
                                        defaultColumns={defaultColumns}
                                        tableId="checkpoints">
                                        <CheckpointTable
                                            checkpoints={checkpoints}
                                            onSelected={(checkpoints) =>
                                                setSelected(checkpoints)
                                            }
                                        />
                                    </TableContainer>
                                ) : (
                                    <div>Laster sjekkpunkter</div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SkjemaTemplateNewView;
