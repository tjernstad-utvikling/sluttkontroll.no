import { Card, CardContent, CardMenu } from '../components/card';
import {
    useAddAvvikImage,
    useAvvikById,
    useCloseAvvik,
    useDeleteAvvik,
    useOpenAvvik
} from '../api/hooks/useAvvik';
import { useHistory, useParams } from 'react-router-dom';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Avvik } from '../contracts/avvikApi';
import { AvvikCommentModal } from '../modal/avvikComment';
import { AvvikEditModal } from '../modal/avvik';
import { AvvikImageCard } from '../components/avvik';
import { AvvikPageViewParams } from '../contracts/navigation';
import { AvvikUtbedrereModal } from '../modal/avvikUtbedrere';
import { AvvikValueGetter } from '../tables/avvik';
import BuildIcon from '@mui/icons-material/Build';
import Container from '@mui/material/Container';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { NewImageModal } from '../modal/newImage';
import PersonIcon from '@mui/icons-material/Person';
import { Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { format } from 'date-fns';
import { makeStyles } from '../theme/makeStyles';
import { useConfirm } from '../hooks/useConfirm';
import { useKontrollById } from '../api/hooks/useKontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useSkjemaerByKontrollId } from '../api/hooks/useSkjema';
import { useState } from 'react';

const AvvikView = () => {
    const { classes } = usePageStyles();
    const { classes: classes2 } = useStyles();
    const { avvikId, kontrollId } = useParams<AvvikPageViewParams>();

    const history = useHistory();

    const avvikData = useAvvikById(Number(avvikId));

    enum Modals {
        utbedrer,
        comment,
        addImage
    }
    const [modalOpen, setModalOpen] = useState<Modals>();

    const [editId, setEditId] = useState<number>();

    const kontrollData = useKontrollById(Number(kontrollId));

    const skjemaData = useSkjemaerByKontrollId(Number(kontrollId));

    const { confirm } = useConfirm();

    const closeAvvikMutation = useCloseAvvik({ isFromDetailsPage: true });

    async function closeAvvik(selectedAvvik: number[], kommentar: string) {
        try {
            await closeAvvikMutation.mutateAsync({
                avvikList: selectedAvvik,
                kommentar
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    const openAvvikMutation = useOpenAvvik({ isFromDetailsPage: true });

    async function openAvvik(avvikId: number) {
        try {
            await openAvvikMutation.mutateAsync({
                avvikId
            });
            return true;
        } catch (error) {
            return false;
        }
    }
    const deleteMutation = useDeleteAvvik();

    const newImageMutation = useAddAvvikImage();
    async function addAvvikImages(avvik: Avvik, images: File[]) {
        try {
            newImageMutation.mutateAsync({
                avvik,
                images
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    const askToDeleteAvvik = async () => {
        if (avvikData.data !== undefined) {
            const isConfirmed = await confirm(
                `Slette avvikID: ${avvikData.data.id}?`
            );

            if (isConfirmed) {
                try {
                    deleteMutation.mutateAsync({
                        avvikId: avvikData.data.id
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    history.goBack();
                }
            }
        }
    };

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card
                            title="Avvik"
                            menu={
                                <CardMenu
                                    items={[
                                        {
                                            label: 'Sett utbedrere',
                                            icon: <PersonIcon />,
                                            action: () =>
                                                setModalOpen(Modals.utbedrer)
                                        },
                                        {
                                            label: 'Legg til bilde(r)',
                                            icon: <AddPhotoAlternateIcon />,
                                            action: () =>
                                                setModalOpen(Modals.addImage)
                                        },
                                        {
                                            label: 'Lukk avvik',
                                            icon: <BuildIcon />,
                                            skip:
                                                avvikData.data?.status ===
                                                'lukket',
                                            action: () =>
                                                setModalOpen(Modals.comment)
                                        },
                                        {
                                            label: 'Slett',
                                            icon: <DeleteForeverIcon />,
                                            skip:
                                                avvikData.data?.status ===
                                                'lukket',
                                            action: () => askToDeleteAvvik()
                                        },
                                        {
                                            label: 'Åpne',
                                            icon: <LockOpenIcon />,
                                            skip:
                                                avvikData.data?.status !==
                                                'lukket',
                                            action: () => {
                                                if (
                                                    avvikData.data !== undefined
                                                )
                                                    openAvvik(
                                                        avvikData.data.id
                                                    );
                                            }
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                <Grid container>
                                    <Grid
                                        item
                                        className={clsx(
                                            classes2.topDecoration,
                                            {
                                                [classes2.topDecorationClosed]:
                                                    avvikData.data?.status ===
                                                    'lukket'
                                            }
                                        )}
                                        xs={12}></Grid>
                                    <Grid item xs={12} sm={5}>
                                        <dl className={classes2.list}>
                                            <dt>Oppdaget</dt>
                                            <dd>
                                                {avvikData.data
                                                    ?.registrertDato &&
                                                    format(
                                                        new Date(
                                                            avvikData.data?.registrertDato
                                                        ),
                                                        'dd.MM.yyyy'
                                                    )}
                                            </dd>

                                            <dt>Kontroll</dt>
                                            <dd>
                                                {avvikData.data &&
                                                    AvvikValueGetter(
                                                        avvikData.data
                                                    ).kontroll(
                                                        kontrollData.data
                                                            ? [
                                                                  kontrollData.data
                                                              ]
                                                            : []
                                                    )}
                                            </dd>

                                            <dt>Areal</dt>
                                            <dd>
                                                {avvikData.data &&
                                                    AvvikValueGetter(
                                                        avvikData.data
                                                    ).area(
                                                        skjemaData.data ?? []
                                                    )}
                                            </dd>

                                            <dt>Området</dt>
                                            <dd>
                                                {avvikData.data &&
                                                    AvvikValueGetter(
                                                        avvikData.data
                                                    ).omrade(
                                                        skjemaData.data ?? []
                                                    )}
                                            </dd>
                                            <Divider />
                                            <Typography style={{ padding: 5 }}>
                                                {avvikData.data?.beskrivelse}
                                            </Typography>
                                            <Divider />
                                        </dl>
                                    </Grid>
                                    <Grid item xs={12} sm={7}>
                                        <div
                                            className={classes2.imageContainer}>
                                            {avvikData.data?.avvikBilder?.map(
                                                (ab) => (
                                                    <AvvikImageCard
                                                        key={ab.id}
                                                        avvikBilde={ab}
                                                        avvik={avvikData.data}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <AvvikEditModal
                close={() => {
                    setEditId(undefined);
                }}
                editId={editId}
            />
            {avvikData.data !== undefined && (
                <>
                    <NewImageModal
                        avvik={avvikData.data}
                        open={modalOpen === Modals.addImage}
                        close={() => setModalOpen(undefined)}
                        addAvvikImages={addAvvikImages}
                    />
                    <AvvikUtbedrereModal
                        open={modalOpen === Modals.utbedrer}
                        close={() => setModalOpen(undefined)}
                        selectedAvvik={[avvikData.data.id]}
                        kontrollId={Number(kontrollId)}
                    />
                    <AvvikCommentModal
                        closeAvvik={closeAvvik}
                        open={modalOpen === Modals.comment}
                        close={() => setModalOpen(undefined)}
                        selectedAvvik={[avvikData.data.id]}
                    />
                </>
            )}
        </>
    );
};

export default AvvikView;

const useStyles = makeStyles()((theme: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    list: {
        padding: 10,
        marginBottom: 10,
        '& dt': {
            fontWeight: 'bold'
        }
    },
    imageContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    topDecoration: {
        height: 15,
        background:
            'linear-gradient(0deg, rgba(255,255,255,1) 0%, #F3A712 100%)'
    },
    topDecorationClosed: {
        background:
            'linear-gradient(0deg, rgba(255,255,255,1) 0%, #8FC93A 100%)'
    }
}));
