import { Card, CardMenu } from '../components/card';
import { SkjemaTable, columns, defaultColumns } from '../tables/skjema';
import { useEffect, useState } from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Skjema } from '../contracts/kontrollApi';
import { SkjemaerViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';

const SkjemaerView = () => {
    const classes = usePageStyles();
    const { kontrollId } = useParams<SkjemaerViewParams>();

    const [_skjemaer, setSkjemaer] = useState<Array<Skjema>>([]);
    const {
        state: { skjemaer, kontroller },
        loadKontroller
    } = useKontroll();

    useEffectOnce(() => {
        loadKontroller();
    });

    useEffect(() => {
        if (skjemaer !== undefined) {
            setSkjemaer(
                skjemaer.filter((s) => s.kontroll.id === Number(kontrollId))
            );
        }
    }, [skjemaer, kontrollId]);

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Skjemaer" menu={<CardMenu />}>
                            {skjemaer !== undefined ? (
                                <TableContainer
                                    columns={columns(kontroller ?? [], '')}
                                    defaultColumns={defaultColumns}
                                    tableId="skjemaer">
                                    <SkjemaTable skjemaer={_skjemaer} />
                                </TableContainer>
                            ) : (
                                <div>Laster skjemaer</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default SkjemaerView;
