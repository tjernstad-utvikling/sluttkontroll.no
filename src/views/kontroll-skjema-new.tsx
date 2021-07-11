import { CheckpointTable, columns, defaultColumns } from '../tables/checkpoint';

import { Card } from '../components/card';
import { Checkpoint } from '../contracts/checkpointApi';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { SkjemaSchema } from '../schema/skjema';
import { TableContainer } from '../tables/tableContainer';
import { getCheckpoints } from '../api/checkpointApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useHistory } from 'react-router-dom';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const SkjemaNewView = () => {
    const classes = usePageStyles();

    const history = useHistory();

    const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);

    useEffectOnce(async () => {
        try {
            const res = await getCheckpoints();
            if (res.status === 200) {
                setCheckpoints(res.checkpoints);
            }
        } catch (error) {}
    });

    const onSaveSkjema = async (
        omrade: string,
        area: string
    ): Promise<boolean> => {
        return false;
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Nytt skjema">
                            <SkjemaSchema onSubmit={onSaveSkjema} />

                            {checkpoints !== undefined ? (
                                <TableContainer
                                    columns={columns('')}
                                    defaultColumns={defaultColumns}
                                    tableId="checkpoints">
                                    <CheckpointTable
                                        checkpoints={checkpoints}
                                    />
                                </TableContainer>
                            ) : (
                                <div>Laster sjekkpunkter</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default SkjemaNewView;
