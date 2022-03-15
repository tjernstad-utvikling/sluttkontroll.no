import { Card, CardContent, CardMenu } from '../components/card';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { AvvikImageCard } from '../components/avvik';
import { AvvikValueGetter } from '../tables/avvik';
import BuildIcon from '@mui/icons-material/Build';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import { ExternalAvvikPageViewParams } from '../contracts/navigation';
import Grid from '@mui/material/Grid';
import { Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { format } from 'date-fns';
import { makeStyles } from '../theme/makeStyles';
import { useAvvikById } from '../api/hooks/useAvvik';
import { useConfirm } from '../hooks/useConfirm';
import { useExternalKontroller } from '../api/hooks/useKontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const AvvikView = () => {
    const { classes } = usePageStyles();
    const { classes: classes2 } = useStyles();
    const { avvikId } = useParams<ExternalAvvikPageViewParams>();

    const avvik = useAvvikById(Number(avvikId));
    const externalKontrollData = useExternalKontroller();

    enum Modals {
        utbedrer,
        comment,
        addImage
    }
    const [modalOpen, setModalOpen] = useState<Modals>();

    const { confirm } = useConfirm();

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
                                            label: 'Legg til bilde(r)',
                                            icon: <AddPhotoAlternateIcon />,
                                            action: () =>
                                                setModalOpen(Modals.addImage)
                                        },
                                        {
                                            label: 'Lukk avvik',
                                            icon: <BuildIcon />,
                                            skip:
                                                avvik.data?.status === 'lukket',
                                            action: () =>
                                                setModalOpen(Modals.comment)
                                        }
                                    ]}
                                />
                            }>
                            <CardContent>
                                {avvik.data !== undefined &&
                                externalKontrollData.data?.kontroller !==
                                    undefined &&
                                externalKontrollData.data?.skjemaer !==
                                    undefined ? (
                                    <Grid container>
                                        <Grid
                                            item
                                            className={clsx(
                                                classes2.topDecoration,
                                                {
                                                    [classes2.topDecorationClosed]:
                                                        avvik.data.status ===
                                                        'lukket'
                                                }
                                            )}
                                            xs={12}></Grid>
                                        <Grid item xs={12} sm={5}>
                                            <dl className={classes2.list}>
                                                <dt>Oppdaget</dt>
                                                <dd>
                                                    {format(
                                                        new Date(
                                                            avvik.data.registrertDato
                                                        ),
                                                        'dd.MM.yyyy'
                                                    )}
                                                </dd>

                                                <dt>Kontroll</dt>
                                                <dd>
                                                    {AvvikValueGetter(
                                                        avvik.data
                                                    ).kontroll(
                                                        externalKontrollData
                                                            .data.kontroller
                                                    )}
                                                </dd>

                                                <dt>Areal</dt>
                                                <dd>
                                                    {AvvikValueGetter(
                                                        avvik.data
                                                    ).area(
                                                        externalKontrollData
                                                            .data.skjemaer
                                                    )}
                                                </dd>

                                                <dt>Området</dt>
                                                <dd>
                                                    {AvvikValueGetter(
                                                        avvik.data
                                                    ).omrade(
                                                        externalKontrollData
                                                            .data.skjemaer
                                                    )}
                                                </dd>
                                                <Divider />
                                                <Typography
                                                    style={{ padding: 5 }}>
                                                    {avvik.data.beskrivelse}
                                                </Typography>
                                                <Divider />
                                            </dl>
                                        </Grid>
                                        <Grid item xs={12} sm={7}>
                                            <div
                                                className={
                                                    classes2.imageContainer
                                                }>
                                                {avvik.data.avvikBilder.map(
                                                    (ab) => (
                                                        <AvvikImageCard
                                                            key={ab.id}
                                                            avvikBilde={ab}
                                                            avvik={avvik.data}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <div>Laster avvik</div>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
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
