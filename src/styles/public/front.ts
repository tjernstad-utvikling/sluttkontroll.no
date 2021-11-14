import { Theme } from '@mui/material';
import { makeStyles } from '../../theme/makeStyles';

export const useFrontStyles = makeStyles()((theme: Theme) => ({
    root: {
        height: '100vh'
    },
    image: {
        backgroundImage: 'url(/images/front.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'grey',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },
    paper: {
        margin: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: '5px',
        backgroundColor: theme.palette.primary.main
    },
    form: {
        marginTop: '5px'
    },
    submit: {
        margin: '5px'
    },
    errorText: {
        color: theme.palette.error.main
    }
}));
