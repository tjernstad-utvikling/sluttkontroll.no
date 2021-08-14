import { Avvik, AvvikBilde } from '../contracts/avvikApi';
import { useEffect, useMemo, useState } from 'react';

import BuildIcon from '@material-ui/icons/Build';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import { Image } from './image';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { RowAction } from '../tables/tableUtils';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

interface AvvikCardProps {
    avvik: Avvik;
    deleteAvvik: (avvikId: number) => void;
    edit: (avvikId: number) => void;
    open: (avvikId: number) => void;
    close: (avvikId: number) => void;
    onSelect: (
        event: React.ChangeEvent<HTMLInputElement>,
        avvik: Avvik
    ) => void;
    checked: boolean;
}
export function AvvikCard({
    avvik,
    deleteAvvik,
    edit,
    open,
    close,
    onSelect,
    checked
}: AvvikCardProps) {
    const classes = useStyles();

    const textLength = 60;
    var trimmedBeskrivelse = useMemo(
        () =>
            avvik.beskrivelse.length > textLength
                ? avvik.beskrivelse.substring(0, textLength - 3) + '...'
                : avvik.beskrivelse,
        [avvik.beskrivelse]
    );

    return (
        <Card className={classes.cardRoot}>
            <CardActionArea>
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
                                action: () => open(avvik.id),
                                skip: avvik.status !== 'lukket',
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
                                action: () => edit(avvik.id),
                                skip: avvik.status === 'lukket',
                                icon: <EditIcon />
                            },
                            {
                                name: 'Slett',
                                action: () => deleteAvvik(avvik.id),
                                skip: avvik.status === 'lukket',
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
    selected: Avvik[];
    deleteAvvik: (avvikId: number) => void;
    edit: (avvikId: number) => void;
    open: (avvikId: number) => void;
    close: (avvikId: number) => void;
    setSelected: (selected: Avvik[]) => void;
    selectedFromGrid: boolean;
}
export function AvvikGrid(props: AvvikGridProps) {
    const classes = useStyles();
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
            props.setSelected([...props.selected, ...selection]);
        } else {
            const ids = selection.map((a) => a.id);
            props.setSelected(
                props.selected.filter((item) => ids.indexOf(item.id) === -1)
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
        <div className={classes.container}>
            {props.avvik.map((a) => (
                <AvvikCard
                    key={a.id}
                    {...props}
                    avvik={a}
                    onSelect={handleSelect}
                    checked={props.selected.some((s) => s.id === a.id)}
                />
            ))}
        </div>
    );
}

interface AvvikImageCardProps {
    avvikBilde: AvvikBilde;
    avvikStatus: string | null;
    avvikId: number;
}
export const AvvikImageCard = ({
    avvikStatus,
    avvikBilde,
    avvikId
}: AvvikImageCardProps) => {
    const classes = useStyles();
    return (
        <Card className={classes.cardRoot}>
            <CardActionArea>
                <CardMedia component="div">
                    <div style={{ width: 250 }}>
                        <Image
                            src={avvikBilde.image}
                            alt={`avvik bilde for avvik id: ${avvikId}`}
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
                                action: () => console.log(avvikId),
                                skip: avvikStatus === 'lukket',
                                icon: <DeleteForeverIcon />
                            }
                        ]}
                    />
                </div>
            </CardActions>
        </Card>
    );
};

const useStyles = makeStyles({
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
        background:
            'linear-gradient(180deg, rgba(255,255,255,1) 75%, #F3A712 100%)'
    },
    cardActionClosed: {
        background:
            'linear-gradient(180deg, rgba(255,255,255,1) 75%, #8FC93A 100%)'
    }
});
