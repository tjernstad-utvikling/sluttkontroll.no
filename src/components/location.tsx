import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Location } from '../contracts/kontrollApi';
import { LocationImage } from './image';
import { RowAction } from '../tables/base/tableUtils';
import { Theme } from '@mui/material';
import { makeStyles } from '../theme/makeStyles';
import { useDeleteLocationImage } from '../api/hooks/useKlient';

interface LocationImageCardProps {
    location: Location;
    klientId: number;
    openAddImageModal: () => void;
}
export const LocationImageCard = ({
    location,
    klientId,
    openAddImageModal
}: LocationImageCardProps) => {
    const { classes } = useStyles();

    const deleteLocationImageMutation = useDeleteLocationImage();

    async function deleteImage() {
        if (location.locationImage) {
            try {
                await deleteLocationImageMutation.mutateAsync({
                    imageId: location.locationImage.id,
                    locationId: location.id
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

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
                                name: 'Nytt bilde',
                                action: openAddImageModal,
                                icon: <AddAPhotoIcon />
                            },
                            {
                                name: 'Slett',
                                action: deleteImage,
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
