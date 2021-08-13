import { Avvik } from '../contracts/avvikApi';
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
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';
interface AvvikCardProps {
    avvik: Avvik;
    deleteAvvik: (avvikId: number) => void;
    edit: (avvikId: number) => void;
    open: (avvikId: number) => void;
    close: (avvikId: number) => void;
}
export function AvvikCard({
    avvik,
    deleteAvvik,
    edit,
    open,
    close
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
                {avvik.avvikBilder.length > 0 && (
                    <CardMedia
                        component="article"
                        className={classes.media}
                        title={avvik.beskrivelse}>
                        <div style={{ width: 250, height: 155 }}>
                            <Image
                                src={avvik.avvikBilder[0].image}
                                height={avvik.avvikBilder[0].height}
                                width={avvik.avvikBilder[0].width}
                                alt={`avvik bilde for avvik id: ${avvik.id}`}
                                objectFit
                            />
                        </div>
                    </CardMedia>
                )}
                <CardContent>
                    <Typography
                        style={{ fontWeight: 'bold' }}
                        gutterBottom
                        variant="h5"
                        component="h2">
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
            <CardActions>
                <Checkbox
                    defaultChecked
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
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
    deleteAvvik: (avvikId: number) => void;
    edit: (avvikId: number) => void;
    open: (avvikId: number) => void;
    close: (avvikId: number) => void;
}
export function AvvikGrid(props: AvvikGridProps) {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            {props.avvik.map((a) => (
                <AvvikCard key={a.id} {...props} avvik={a} />
            ))}
        </div>
    );
}

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
    }
});
