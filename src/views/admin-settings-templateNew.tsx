import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';

import { Card } from '../components/card';
import { Checkpoint } from '../contracts/checkpointApi';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { SkjemaTemplateSchema } from '../schema/skjemaTemplate';
import { TableContainer } from '../tables/tableContainer';
import { getCheckpoints } from '../api/checkpointApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useHistory } from 'react-router-dom';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const SkjemaTemplateNewView = () => {
    const classes = usePageStyles();

    const history = useHistory();

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

    const onSaveSkjema = async (name: string): Promise<boolean> => {
        // if (await saveNewSkjema(area, omrade, selected, Number(kontrollId))) {
        //     history.goBack();
        //     return true;
        // }
        return false;
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny sjekklistemal">
                            <SkjemaTemplateSchema
                                onSubmit={onSaveSkjema}
                                checkpointCount={selected.length}
                            />

                            {checkpoints !== undefined ? (
                                <TableContainer
                                    columns={columns('')}
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
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SkjemaTemplateNewView;
