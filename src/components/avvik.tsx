import { Avvik, AvvikBilde } from '../contracts/avvikApi';
import { useEffect, useMemo, useState } from 'react';

import BuildIcon from '@mui/icons-material/Build';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Image } from './image';
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { RowAction } from '../tables/base/tableUtils';
import { Theme } from '@mui/material';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { makeStyles } from '../theme/makeStyles';
import { useDeleteAvvikImage } from '../api/hooks/useAvvik';

interface AvvikCardProps {
    avvik: Avvik;
    deleteAvvik?: (avvikId: number) => void;
    edit?: (avvikId: number) => void;
    open?: (avvikId: number) => void;
    close: (avvikId: number) => void;
    onSelect: (
        event: React.ChangeEvent<HTMLInputElement>,
        avvik: Avvik
    ) => void;
    checked: boolean;
    url: string;
}
export function AvvikCard({
    avvik,
    deleteAvvik,
    edit,
    open,
    close,
    onSelect,
    checked,
    url
}: AvvikCardProps) {
    const { classes } = useStyles();

    const textLength = 60;
    const trimmedBeskrivelse = useMemo(
        () =>
            avvik.beskrivelse.length > textLength
                ? avvik.beskrivelse.substring(0, textLength - 3) + '...'
                : avvik.beskrivelse,
        [avvik.beskrivelse]
    );

    return (
        <Card className={classes.cardRoot}>
            <CardActionArea component={Link} to={`${url}/${avvik.id}`}>
                <CardMedia
                    component="article"
                    className={classes.media}
                    title={avvik.beskrivelse}>
                    <div style={{ width: 250, height: 155 }}>
                        <Image
                            src={
                                avvik.avvikBilder.length > 0
                                    ? avvik.avvikBilder[0].image
                                    : undefined
                            }
                            alt={`avvik bilde for avvik id: ${avvik.id}`}
                            objectFit
                        />
                    </div>
                </CardMedia>
                <CardContent>
                    <Typography
                        style={{ fontWeight: 'bold' }}
                        gutterBottom
                        variant="h5"
                        component="h3">
                        ID: {avvik.id}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p">
                        {avvik.discoverLocation}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p">
                        {trimmedBeskrivelse}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions
                className={clsx(classes.cardActions, {
                    [classes.cardActionClosed]: avvik.status === 'lukket'
                })}>
                <Checkbox
                    onChange={(e) => onSelect(e, avvik)}
                    checked={checked}
                    color="primary"
                    inputProps={{ 'aria-label': 'Velg avvik' }}
                />
                <div style={{ marginLeft: 'auto' }}>
                    <RowAction
                        actionItems={[
                            {
                                name: 'Åpne',
                                action: () => open && open(avvik.id),
                                skip:
                                    avvik.status !== 'lukket' ||
                                    open === undefined,
                                icon: <LockOpenIcon />
                            },
                            {
                                name: 'Lukke',
                                action: () => close(avvik.id),
                                skip: avvik.status === 'lukket',
                                icon: <BuildIcon />
                            },
                            {
                                name: 'Rediger',
                                action: () => edit && edit(avvik.id),
                                skip:
                                    avvik.status === 'lukket' ||
                                    edit === undefined,
                                icon: <EditIcon />
                            },
                            {
                                name: 'Slett',
                                action: () =>
                                    deleteAvvik && deleteAvvik(avvik.id),
                                skip:
                                    avvik.status === 'lukket' ||
                                    deleteAvvik === undefined,
                                icon: <DeleteForeverIcon />
                            }
                        ]}
                    />
                </div>
            </CardActions>
        </Card>
    );
}

interface AvvikGridProps {
    avvik: Avvik[];
    selected: number[];
    deleteAvvik?: (avvikId: number) => void;
    edit?: (avvikId: number) => void;
    open?: (avvikId: number) => void;
    close: (avvikId: number) => void;
    setSelected: (selected: number[]) => void;
    selectedFromGrid: boolean;
    url: string;
    leftAction?: React.ReactNode;
    isLoading: boolean;
}
export function AvvikGrid(props: AvvikGridProps) {
    const { classes } = useStyles();
    const [isShift, setIsShift] = useState<boolean>(false);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number>();

    useEffect(() => {
        const handleKey = (event: KeyboardEvent, down: boolean) => {
            if (event.key === 'Shift' && props.selectedFromGrid) {
                setIsShift(down);
            }
        };
        window.addEventListener('keydown', (e) => handleKey(e, true));
        window.addEventListener('keyup', (e) => handleKey(e, false));

        // cleanup this component
        return () => {
            window.removeEventListener('keydown', (e) => handleKey(e, true));
            window.removeEventListener('keyup', (e) => handleKey(e, false));
        };
    }, [props.selectedFromGrid]);

    const handleSelected = (checked: boolean, selection: Avvik[]) => {
        if (checked) {
            props.setSelected([
                ...props.selected,
                ...selection.map((a) => a.id)
            ]);
        } else {
            const ids = selection.map((a) => a.id);
            props.setSelected(
                props.selected.filter((item) => ids.indexOf(item) === -1)
            );
        }
    };

    const handleSelect = (
        event: React.ChangeEvent<HTMLInputElement>,
        selectedAvvik: Avvik
    ) => {
        const index = props.avvik.findIndex((k) => k.id === selectedAvvik.id);

        if (isShift) {
            if (lastSelectedIndex === undefined) {
                return;
            }

            if (index === lastSelectedIndex) {
                return;
            }
            const subsetArray = props.avvik.slice(
                Math.min(index, lastSelectedIndex),
                Math.max(index, lastSelectedIndex) + 1
            );

            handleSelected(event.target.checked, subsetArray);
        } else {
            handleSelected(event.target.checked, [selectedAvvik]);
        }

        setLastSelectedIndex(index);
    };
    return (
        <>
            <div className={classes.pasteTool}>{props.leftAction}</div>
            <div className={classes.container}>
                {props.isLoading && <LinearProgress />}
                {props.avvik.map((a) => (
                    <AvvikCard
                        key={a.id}
                        {...props}
                        avvik={a}
                        onSelect={handleSelect}
                        checked={props.selected.some((s) => s === a.id)}
                        url={props.url}
                    />
                ))}
            </div>
        </>
    );
}

interface AvvikImageCardProps {
    avvikBilde: AvvikBilde;
    avvik: Avvik;
}
export const AvvikImageCard = ({ avvikBilde, avvik }: AvvikImageCardProps) => {
    const { classes } = useStyles();

    const deleteImageMutation = useDeleteAvvikImage();

    async function deleteAvvikImage(avvik: Avvik, avvikBildeId: number) {
        try {
            await deleteImageMutation.mutateAsync({
                avvik,
                imageId: avvikBildeId
            });
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Card className={classes.cardRoot}>
            <CardActionArea>
                <CardMedia component="div">
                    <div style={{ width: 250 }}>
                        <Image
                            src={avvikBilde.image}
                            alt={`avvik bilde for avvik id: ${avvik.id}`}
                        />
                    </div>
                </CardMedia>
            </CardActionArea>
            <CardActions>
                <div style={{ marginLeft: 'auto' }}>
                    <RowAction
                        actionItems={[
                            {
                                name: 'Slett',
                                action: () =>
                                    deleteAvvikImage(avvik, avvikBilde.id),
                                skip: avvik.status === 'lukket',
                                icon: <DeleteForeverIcon />
                            }
                        ]}
                    />
                </div>
            </CardActions>
        </Card>
    );
};
interface NewImageCardProps {
    file: File;
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}
export const NewImageCard = ({ file, setFiles }: NewImageCardProps) => {
    const { classes } = useStyles();
    const deleteFile = () => {
        setFiles((images) => images.filter((img) => img.name !== file.name));
    };
    return (
        <Card className={classes.cardRoot}>
            <CardActionArea>
                <CardMedia component="div">
                    <div style={{ width: 250 }}>
                        <Image file={file} alt="Nytt bilde" />
                    </div>
                </CardMedia>
            </CardActionArea>
            <CardActions>
                <div style={{ marginLeft: 'auto' }}>
                    <Button
                        onClick={() => deleteFile()}
                        color="primary"
                        startIcon={<DeleteForeverIcon />}>
                        Slett
                    </Button>
                </div>
            </CardActions>
        </Card>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    cardRoot: {
        maxWidth: 250,
        margin: 5
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    media: {
        height: 140
    },
    cardActions: {
        background: `linear-gradient(180deg, rgba(255,255,255,1) 75%, ${theme.palette.warning.main} 100%)`
    },
    cardActionClosed: {
        background: `linear-gradient(180deg, rgba(255,255,255,1) 75%, ${theme.palette.success.main} 100%)`
    },
    pasteTool: {
        flexGrow: 1,
        height: '4em'
    }
}));
