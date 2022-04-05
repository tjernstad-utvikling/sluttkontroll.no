import { Card, CardContent, CardMenu } from '../components/card';
import {
    ClipboardCard,
    KontrollClipboard,
    MeasurementClipboard,
    SkjemaClipboard
} from '../components/clipboard';
import { SkjemaTable, columns, defaultColumns } from '../tables/skjema';
import { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { CommentModal } from '../modal/comment';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { PasteButton } from '../components/clipboard';
import { Skjema } from '../contracts/kontrollApi';
import { SkjemaEditModal } from '../modal/skjema';
import { SkjemaerViewParams } from '../contracts/navigation';
import { TableContainer } from '../tables/tableContainer';
import { useAvvik } from '../data/avvik';
import { useClipBoard } from '../data/clipboard';
import { useConfirm } from '../hooks/useConfirm';
import { useHotkeys } from 'react-hotkeys-hook';
import { useKontroll } from '../data/kontroll';
import { useKontrollById } from '../api/hooks/useKontroll';
import { useMeasurement } from '../data/measurement';
import { usePageStyles } from '../styles/kontroll/page';
import { useSkjemaerByKontrollId } from '../api/hooks/useSkjema';

const SkjemaerView = () => {
    const { classes } = usePageStyles();
    const { kontrollId } = useParams<SkjemaerViewParams>();
    const { url } = useRouteMatch();
    const history = useHistory();

    const { confirm } = useConfirm();

    /**
     * Hotkeys
     */
    useHotkeys('n', () => history.push(`${url}/skjema/new`)); // new skjema
    /***** */

    const { removeSkjema } = useKontroll();

    const kontrollData = useKontrollById(Number(kontrollId));

    const skjemaData = useSkjemaerByKontrollId(Number(kontrollId));

    const {
        state: { avvik }
    } = useAvvik();

    const {
        state: { measurements }
    } = useMeasurement();

    const [editId, setEditId] = useState<number>();
    const [commentId, setCommentId] = useState<number | undefined>(undefined);

    const deleteSkjema = async (skjemaId: number) => {
        const skjema = skjemaData.data?.find((s) => s.id === skjemaId);
        if (skjema !== undefined) {
            const isConfirmed = await confirm(
                `Slette ${skjema.area} - ${skjema.omrade}?`
            );

            if (isConfirmed) {
                removeSkjema(skjemaId);
            }
        }
    };

    /**
     * Clipboard
     */
    const {
        state: { skjemaToPast, measurementToPast },
        openScissors,
        closeScissors,
        selectedSkjemaer,
        clipboardHasSkjema,
        clipboardHasMeasurement,
        clipboardHasKontroll
    } = useClipBoard();
    useEffect(() => {
        openScissors();
        return () => {
            closeScissors();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSelectForClipboard = (ids: number[]) => {
        if (skjemaData.data)
            selectedSkjemaer(
                skjemaData.data.filter((skjema) => {
                    return ids.includes(skjema.id);
                })
            );
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={
                            clipboardHasSkjema ||
                            clipboardHasMeasurement ||
                            clipboardHasKontroll
                                ? 9
                                : 12
                        }>
                        <Card
                            title="Skjemaer"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Nytt skjema',
                                            to: `${url}/skjema/new`
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                <TableContainer
                                    columns={columns(
                                        kontrollData.data,
                                        avvik ?? [],
                                        measurements ?? [],
                                        url,
                                        deleteSkjema,
                                        setEditId,
                                        clipboardHasMeasurement,
                                        measurementToPast,
                                        setCommentId
                                    )}
                                    defaultColumns={defaultColumns}
                                    tableId="skjemaer">
                                    <SkjemaTable
                                        skjemaer={skjemaData.data ?? []}
                                        isLoading={skjemaData.isLoading}
                                        onSelected={onSelectForClipboard}
                                        leftAction={
                                            <PasteButton
                                                clipboardHas={
                                                    clipboardHasSkjema
                                                }
                                                options={{
                                                    skjemaPaste: {
                                                        kontrollId:
                                                            Number(kontrollId),
                                                        skjema: skjemaToPast
                                                    }
                                                }}
                                            />
                                        }
                                    />
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    {(clipboardHasSkjema ||
                        clipboardHasMeasurement ||
                        clipboardHasKontroll) && (
                        <ClipboardCard>
                            {clipboardHasKontroll && <KontrollClipboard />}
                            {clipboardHasSkjema && <SkjemaClipboard />}
                            {clipboardHasMeasurement && (
                                <MeasurementClipboard />
                            )}
                        </ClipboardCard>
                    )}
                </Grid>
            </Container>
            <SkjemaEditModal
                editId={editId}
                close={() => setEditId(undefined)}
            />
            <CommentModal
                skjemaId={commentId}
                open={commentId ? true : false}
                close={() => setCommentId(undefined)}
            />
        </>
    );
};

export default SkjemaerView;
