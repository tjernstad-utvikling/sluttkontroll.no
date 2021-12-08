import { Card, CardContent } from '../components/card';
import { getImageFile, uploadImageFile } from '../api/imageApi';
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

    async function handleSaveImage(file: File): Promise<{
        success: boolean;
        file: { url: string; id: number };
    }> {
        try {
            const { status, image } = await uploadImageFile(
                Number(kontrollId),
                file
            );
            if (status === 200 && image) {
                enqueueSnackbar('Bilde er lastet opp', {
                    variant: 'success'
                });
                return {
                    success: true,
                    file: image
                };
            }
        } catch (error) {
            enqueueSnackbar('Problemer med lagring av bildet', {
                variant: 'error'
            });
        }
        return { success: false, file: { url: '', id: 0 } };
    }
    async function handleGetImage(name: string): Promise<{
        data: Blob;
    }> {
        try {
            const res = await getImageFile(name);
            if (res.status === 200) {
                return res;
            }
        } catch (error: any) {
            enqueueSnackbar('Problemer med lasting av bildet', {
                variant: 'error'
            });
            throw new Error(error);
        }
        throw new Error('');
    }
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
                                        uploadImage={handleSaveImage}
                                        loadImage={handleGetImage}
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
