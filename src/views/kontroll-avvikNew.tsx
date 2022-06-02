import { Card, CardContent } from '../components/card';
import { useHistory, useParams } from 'react-router-dom';

import { AvvikNewViewParams } from '../contracts/navigation';
import { AvvikSchema } from '../schema/avvik';
import Container from '@mui/material/Container';
import { DropZone } from '../components/uploader';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { NewImageCard } from '../components/avvik';
import Typography from '@mui/material/Typography';
import { User } from '../contracts/userApi';
import { useChecklistById } from '../api/hooks/useChecklist';
import { useNewAvvik } from '../api/hooks/useAvvik';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const AvvikNewView = () => {
    const { classes } = usePageStyles();
    const { checklistId } = useParams<AvvikNewViewParams>();

    const history = useHistory();

    const [images, setImages] = useState<File[]>([]);

    const checklistData = useChecklistById(Number(checklistId));

    const newAvvikMutation = useNewAvvik();

    const saveNewAvvik = async (
        beskrivelse: string,
        kommentar: string,
        utbedrer: User[] | null
    ) => {
        try {
            await newAvvikMutation.mutateAsync({
                beskrivelse,
                kommentar,
                utbedrer,
                checklistId: Number(checklistId),
                images
            });
        } catch (error) {
            console.log(error);
        } finally {
            history.goBack();
            return true;
        }
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Nytt Avvik">
                            <CardContent>
                                {checklistData.isLoading && <LinearProgress />}
                                {checklistData.isFetched && (
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <AvvikSchema
                                                beskrivelse={
                                                    checklistData.data
                                                        ?.checkpoint.tekst
                                                }
                                                onSubmit={saveNewAvvik}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h5"
                                                component="h3">
                                                Legg til bilder
                                            </Typography>
                                            <DropZone
                                                accept="image/png, image/jpeg"
                                                setFiles={setImages}
                                                files={images}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        flexWrap: 'wrap',
                                                        alignItems: 'flex-start'
                                                    }}>
                                                    {images.map((img) => (
                                                        <NewImageCard
                                                            key={img.name}
                                                            file={img}
                                                            setFiles={setImages}
                                                        />
                                                    ))}
                                                </div>
                                            </DropZone>
                                        </Grid>
                                    </Grid>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default AvvikNewView;
