import MDEditor, { commands } from '@uiw/react-md-editor';
import { getInfoText, setInfoText as setInfoTextApi } from '../api/settingsApi';

import { Card } from '../components/card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { LoadingButton } from '../components/button';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { usePageStyles } from '../styles/kontroll/page';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

const InfoTextView = () => {
    const { classes } = usePageStyles();
    const [_infoText, setInfoText] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffectOnce(async () => {
        setIsSubmitting(true);
        const { status, infoText } = await getInfoText();
        if (status === 200) {
            setInfoText(infoText);
            setIsSubmitting(false);
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
    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Sluttkontrollrapport informasjonstekst">
                            <div style={{ padding: 15 }}>
                                <MDEditor
                                    value={_infoText}
                                    onChange={setInfoText}
                                    commands={[
                                        // Custom Toolbars

                                        commands.group(
                                            [commands.title1, commands.title2],
                                            {
                                                name: 'title',
                                                groupName: 'title',
                                                buttonProps: {
                                                    'aria-label': 'Insert title'
                                                }
                                            }
                                        )
                                    ]}
                                />
                                <LoadingButton
                                    isLoading={isSubmitting}
                                    type="button"
                                    onClick={handleSaving}
                                    fullWidth
                                    variant="contained"
                                    color="primary">
                                    Lagre
                                </LoadingButton>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default InfoTextView;
