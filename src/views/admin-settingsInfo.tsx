import { Card, CardContent } from '../components/card';
import { getInfoText, setInfoText as setInfoTextApi } from '../api/settingsApi';

import Container from '@mui/material/Container';
import { Editor } from '../tools/editor';
import Grid from '@mui/material/Grid';
import { LoadingButton } from '../components/button';
import { OutputData } from '@editorjs/editorjs';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { getImageFile } from '../api/imageApi';

const InfoTextView = () => {
    const { classes } = usePageStyles();
    const [_infoText, setInfoText] = useState<OutputData>();
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffectOnce(async () => {
        setIsSubmitting(true);
        const { status, infoText } = await getInfoText();
        if (status === 200) {
            setInfoText(infoText);
            setIsSubmitting(false);
            setHasLoaded(true);
        }
    });

    const handleSaving = async () => {
        setIsSubmitting(true);
        if (_infoText !== undefined) {
            const { status } = await setInfoTextApi(_infoText);
            if (status === 204) {
                enqueueSnackbar('informasjonstekst er lagret', {
                    variant: 'success'
                });
            } else {
                enqueueSnackbar(
                    'Ukjent problem med lagring av informasjonstekst',
                    {
                        variant: 'error'
                    }
                );
            }
        }
        setIsSubmitting(false);
    };

    async function handleSaveImage(file: File): Promise<{
        success: boolean;
        file: { url: string; id: number };
    }> {
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
                        <Card title="Sluttkontrollrapport informasjonstekst">
                            <CardContent>
                                {hasLoaded && (
                                    <Editor
                                        setContent={setInfoText}
                                        text={_infoText}
                                        uploadImage={handleSaveImage}
                                        loadImage={handleGetImage}
                                    />
                                )}
                                <LoadingButton
                                    isLoading={isSubmitting}
                                    type="button"
                                    onClick={handleSaving}
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

export default InfoTextView;
