import { Card, CardContent } from '../components/card';
import { getReportStatement, updateReportStatement } from '../api/reportApi';
import { useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import { Editor } from '../tools/editor';
import Grid from '@mui/material/Grid';
import { KontrollReportStatementViewParams } from '../contracts/navigation';
import { LoadingButton } from '../components/button';
import { OutputData } from '@editorjs/editorjs';
import { useDebounce } from '../hooks/useDebounce';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';

const ReportStatement = () => {
    const { classes } = usePageStyles();
    const [statement, setStatement] = useState<OutputData>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);
    const { kontrollId } = useParams<KontrollReportStatementViewParams>();

    const { enqueueSnackbar } = useSnackbar();

    const debouncedSearchTerm: OutputData | undefined = useDebounce<
        OutputData | undefined
    >(statement, 3000);
    // Effect for API call
    useEffect(
        () => {
            const save = async () => {
                if (debouncedSearchTerm) {
                    setIsSubmitting(true);
                    updateReportStatement(
                        debouncedSearchTerm,
                        Number(kontrollId)
                    ).then((results) => {
                        setIsSubmitting(false);
                    });
                }
            };
            save();
        },
        [debouncedSearchTerm, kontrollId] // Only call effect if debounced search term changes
    );

    useEffectOnce(async () => {
        setIsSubmitting(true);
        const { status, rapportStatement: text } = await getReportStatement(
            Number(kontrollId)
        );
        if (status === 200) {
            setStatement(text);
            setIsSubmitting(false);
            setHasLoaded(true);
        }
    });

    // const handleSaving = async () => {
    //     setIsSubmitting(true);
    //     if (_infoText !== undefined) {
    //         const { status } = await setInfoTextApi(_infoText);
    //         if (status === 204) {
    //             enqueueSnackbar('informasjonstekst er lagret', {
    //                 variant: 'success'
    //             });
    //         } else {
    //             enqueueSnackbar(
    //                 'Ukjent problem med lagring av informasjonstekst',
    //                 {
    //                     variant: 'error'
    //                 }
    //             );
    //         }
    //     }
    //     setIsSubmitting(false);
    // };
    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Kontrollerklæring">
                            <CardContent>
                                {hasLoaded && (
                                    <Editor
                                        setContent={setStatement}
                                        text={statement}
                                    />
                                )}
                                <LoadingButton
                                    isLoading={isSubmitting}
                                    type="button"
                                    onClick={() => console.log()}
                                    fullWidth
                                    variant="contained"
                                    color="primary">
                                    Lagre
                                </LoadingButton>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default ReportStatement;
