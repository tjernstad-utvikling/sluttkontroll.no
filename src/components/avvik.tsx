import { Avvik } from '../contracts/avvikApi';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Image } from './image';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
interface AvvikCardProps {
    avvik: Avvik;
}
export function AvvikCard({ avvik }: AvvikCardProps) {
    const classes = useStyles();

    console.log({ avvik });
    return (
        <Card className={classes.root}>
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
                                alt={avvik.beskrivelse}
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
                        {avvik.beskrivelse}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
                <Button size="small" color="primary">
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );
}

const useStyles = makeStyles({
    root: {
        maxWidth: 250
    },
    media: {
        height: 140
    }
});
