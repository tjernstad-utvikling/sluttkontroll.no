import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Location } from '../contracts/kontrollApi';
import { LocationImage } from './image';
import { RowAction } from '../tables/tableUtils';
import { Theme } from '@mui/material';
import { makeStyles } from '../theme/makeStyles';

interface LocationImageCardProps {
    location: Location;
}
export const LocationImageCard = ({ location }: LocationImageCardProps) => {
    const { classes } = useStyles();

    return (
        <Card className={classes.cardRoot}>
            <CardActionArea>
                <CardMedia component="div">
                    <div style={{ width: 250 }}>
                        <LocationImage
                            src={
                                location.locationImage
                                    ? location.locationImage.url
                                    : undefined
                            }
                            alt={`Bilde av lokasjon id: ${location.id}`}
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
                                action: () => console.log(),
                                icon: <DeleteForeverIcon />
                            }
                        ]}
                    />
                </div>
            </CardActions>
        </Card>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    cardRoot: {
        maxWidth: 250,
        margin: 5
    }
}));
