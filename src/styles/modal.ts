import { Theme } from '@mui/material';
import { makeStyles } from '../theme/makeStyles';

export const useModalStyles = makeStyles()((theme: Theme) => ({
    root: {
        backgroundColor: '#fff',
        margin: 15,
        padding: 15,
        borderRadius: 5,
        maxHeight: '95vh',
        overflow: 'auto'
    }
}));
