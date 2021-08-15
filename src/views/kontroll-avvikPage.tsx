import { Card, CardMenu } from '../components/card';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import { Avvik } from '../contracts/avvikApi';
import { AvvikCommentModal } from '../modal/avvikComment';
import { AvvikEditModal } from '../modal/avvik';
import { AvvikImageCard } from '../components/avvik';
import { AvvikPageViewParams } from '../contracts/navigation';
import { AvvikUtbedrereModal } from '../modal/avvikUtbedrere';
import { AvvikValueGetter } from '../tables/avvik';
import BuildIcon from '@material-ui/icons/Build';
import Container from '@material-ui/core/Container';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { NewImageModal } from '../modal/newImage';
import PersonIcon from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useAvvik } from '../data/avvik';
import { useConfirm } from '../hooks/useConfirm';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';

const AvvikView = () => {
    const classes = usePageStyles();
    const classes2 = useStyles();
    const { avvikId } = useParams<AvvikPageViewParams>();

    const history = useHistory();

    const [_avvik, setAvvik] = useState<Avvik>();

    enum Modals {
        utbedrer,
        comment,
        addImage
    }
    const [modalOpen, setModalOpen] = useState<Modals>();

    const [editId, setEditId] = useState<number>();

    const {
        state: { skjemaer, kontroller },
        loadKontroller
    } = useKontroll();

    const { confirm } = useConfirm();
    const {
        state: { avvik },
        deleteAvvik,
        openAvvik
    } = useAvvik();

    useEffectOnce(() => {
        loadKontroller();
    });

    useEffect(() => {
        if (avvik !== undefined) {
            setAvvik(avvik.find((a) => a.id === Number(avvikId)));
        }
    }, [avvik, avvikId]);

    const askToDeleteAvvik = async () => {
        if (_avvik !== undefined) {
            const isConfirmed = await confirm(`Slette avvikID: ${_avvik.id}?`);

            if (isConfirmed) {
                if (await deleteAvvik(_avvik.id)) {
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
                                            skip: _avvik?.status === 'lukket',
                                            action: () =>
                                                setModalOpen(Modals.comment)
                                        },
                                        {
                                            label: 'Slett',
                                            icon: <DeleteForeverIcon />,
                                            skip: _avvik?.status === 'lukket',
                                            action: () => askToDeleteAvvik()
                                        },
                                        {
                                            label: 'Åpne',
                                            icon: <LockOpenIcon />,
                                            skip: _avvik?.status !== 'lukket',
                                            action: () => {
                                                if (_avvik !== undefined)
                                                    openAvvik(_avvik.id);
                                            }
                                        }
                                    ]}
                                />
                            }>
                            {_avvik !== undefined &&
                            kontroller !== undefined &&
                            skjemaer !== undefined ? (
                                <Grid container>
                                    <Grid
                                        item
                                        className={clsx(
                                            classes2.topDecoration,
                                            {
                                                [classes2.topDecorationClosed]:
                                                    _avvik.status === 'lukket'
                                            }
                                        )}
                                        xs={12}></Grid>
                                    <Grid item xs={12} sm={5}>
                                        <dl className={classes2.list}>
                                            <dt>Oppdaget</dt>
                                            <dd>
                                                {format(
                                                    new Date(
                                                        _avvik.registrertDato
                                                    ),
                                                    'dd.MM.yyyy'
                                                )}
                                            </dd>

                                            <dt>Kontroll</dt>
                                            <dd>
                                                {AvvikValueGetter(
                                                    _avvik
                                                ).kontroll(kontroller)}
                                            </dd>

                                            <dt>Areal</dt>
                                            <dd>
                                                {AvvikValueGetter(_avvik).area(
                                                    skjemaer
                                                )}
                                            </dd>

                                            <dt>Området</dt>
                                            <dd>
                                                {AvvikValueGetter(
                                                    _avvik
                                                ).omrade(skjemaer)}
                                            </dd>
                                            <Divider />
                                            <Typography style={{ padding: 5 }}>
                                                {_avvik.beskrivelse}
                                            </Typography>
                                            <Divider />
                                        </dl>
                                    </Grid>
                                    <Grid item xs={12} sm={7}>
                                        <div
                                            className={classes2.imageContainer}>
                                            {_avvik.avvikBilder.map((ab) => (
                                                <AvvikImageCard
                                                    key={ab.id}
                                                    avvikBilde={ab}
                                                    avvik={_avvik}
                                                />
                                            ))}
                                        </div>
                                    </Grid>
                                </Grid>
                            ) : (
                                <div>Laster avvik</div>
                            )}
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
            {_avvik !== undefined && (
                <>
                    <NewImageModal
                        avvik={_avvik}
                        open={modalOpen === Modals.addImage}
                        close={() => setModalOpen(undefined)}
                    />
                    <AvvikUtbedrereModal
                        open={modalOpen === Modals.utbedrer}
                        close={() => setModalOpen(undefined)}
                        selectedAvvik={[_avvik]}
                    />
                    <AvvikCommentModal
                        open={modalOpen === Modals.comment}
                        close={() => setModalOpen(undefined)}
                        selectedAvvik={[_avvik]}
                    />
                </>
            )}
        </>
    );
};

export default AvvikView;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    })
);
