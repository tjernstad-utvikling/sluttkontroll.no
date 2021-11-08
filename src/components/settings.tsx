import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';

interface SettingCardProps {
    to: string;
    image: string;
    title: String;
}
export const SettingCard = ({ to, image, title }: SettingCardProps) => {
    return (
        <Card sx={{ width: 240, margin: '10px' }}>
            <Link to={to} component={CardActionArea}>
                <CardMedia component="img" height="90" image={image} alt="" />
                <CardContent>
                    <Typography
                        gutterBottom
                        variant="h6"
                        style={{ textAlign: 'center' }}
                        component="div">
                        {title}
                    </Typography>
                </CardContent>
            </Link>
        </Card>
    );
};
