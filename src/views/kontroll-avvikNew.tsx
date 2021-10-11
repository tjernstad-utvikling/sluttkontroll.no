import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { AvvikNewViewParams } from '../contracts/navigation';
import { AvvikSchema } from '../schema/avvik';
import { Card } from '../components/card';
import { Checklist } from '../contracts/kontrollApi';
import Container from '@mui/material/Container';
import { DropZone } from '../components/uploader';
import Grid from '@mui/material/Grid';
import { NewImageCard } from '../components/avvik';
import Typography from '@mui/material/Typography';
import { User } from '../contracts/userApi';
import { useAvvik } from '../data/avvik';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';

const AvvikNewView = () => {
    const classes = usePageStyles();
    const { checklistId } = useParams<AvvikNewViewParams>();

    const [checklist, setChecklist] = useState<Checklist>();

    const history = useHistory();

    const {
        state: { checklists },
        loadKontroller
    } = useKontroll();

    const { newAvvik, addAvvikImages } = useAvvik();

    useEffectOnce(() => {
        loadKontroller();
    });

    useEffect(() => {
        if (checklists !== undefined) {
            setChecklist(checklists.find((c) => c.id === Number(checklistId)));
        }
    }, [checklistId, checklists]);

    const [images, setImages] = useState<File[]>([]);

    const saveNewAvvik = async (
        beskrivelse: string,
        kommentar: string,
        utbedrer: Array<User> | null
    ) => {
        const avvik = await newAvvik(
            beskrivelse,
            kommentar,
            utbedrer,
            Number(checklistId)
        );
        if (avvik !== false) {
            if (images.length > 0) {
                if (await addAvvikImages(avvik, images)) {
                    history.goBack();
                    return true;
                }
            } else {
                history.goBack();
                return true;
            }
        }
        return false;
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Nytt Avvik">
                            {checklist !== undefined ? (
                                <Grid container>
                                    <Grid item xs={12}>
                                        <AvvikSchema
                                            beskrivelse={
                                                checklist.checkpoint.tekst
                                            }
                                            onSubmit={saveNewAvvik}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" component="h3">
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
                            ) : (
                                <div>Laster sjekklister</div>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default AvvikNewView;
