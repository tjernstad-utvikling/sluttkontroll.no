import { Card, CardContent, CardMenu } from '../components/card';
import {
    KontrollTable,
    defaultColumns,
    kontrollColumns
} from '../tables/kontroll';
import { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Kontroll } from '../contracts/kontrollApi';
import { KontrollEditModal } from '../modal/kontroll';
import { TableContainer } from '../tables/tableContainer';
import { useAuth } from '../hooks/useAuth';
import { useAvvik } from '../data/avvik';
import { useClient } from '../data/klient';
import { useClipBoard } from '../data/clipboard';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useHistory } from 'react-router-dom';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useUser } from '../data/user';

const KontrollerView = () => {
    const { classes } = usePageStyles();

    const history = useHistory();
    const { user } = useAuth();

    const [_kontroller, setKontroller] = useState<Array<Kontroll>>([]);

    const {
        state: { kontroller },
        loadKontroller,
        toggleStatusKontroll
    } = useKontroll();
    const {
        state: { klienter }
    } = useClient();
    const {
        loadUsers,
        state: { users }
    } = useUser();

    const {
        state: { avvik }
    } = useAvvik();
    const {
        state: { measurements }
    } = useMeasurement();

    useEffectOnce(() => {
        loadKontroller();
        loadUsers();
    });

    /**
     * Clipboard
     */
    const { openScissors, closeScissors } = useClipBoard();
    useEffect(() => {
        openScissors();
        console.log('openScissors');
        return () => {
            closeScissors();
        };
    }, [closeScissors, openScissors]);

    useEffect(() => {
        if (kontroller !== undefined) {
            setKontroller(kontroller.filter((k) => k.user.id === user?.id));
        }
    }, [kontroller, user?.id]);

    const [editId, setEditId] = useState<number>();

    const editKontroll = (id: number) => {
        setEditId(id);
    };

    const closeEdit = () => {
        setEditId(undefined);
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Dine kontroller"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Ny kontroll',
                                            action: () =>
                                                history.push('/kontroll/new')
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                {kontroller !== undefined ? (
                                    <TableContainer
                                        columns={kontrollColumns(
                                            users ?? [],
                                            klienter ?? [],
                                            avvik ?? [],
                                            measurements ?? [],
                                            editKontroll,
                                            toggleStatusKontroll
                                        )}
                                        defaultColumns={defaultColumns}
                                        tableId="kontroller">
                                        <KontrollTable
                                            kontroller={_kontroller}
                                        />
                                    </TableContainer>
                                ) : (
                                    <div>Laster kontroller</div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <KontrollEditModal editId={editId} close={closeEdit} />
        </>
    );
};

export default KontrollerView;
