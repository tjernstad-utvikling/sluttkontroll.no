import { Theme } from '@mui/material';
import { makeStyles } from '../../theme/makeStyles';

export const usePageStyles = makeStyles()((theme: Theme) => ({
    appBarSpacer: {
        minHeight: 56,
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
            minHeight: 48
        },
        [theme.breakpoints.up('sm')]: {
            minHeight: 64
        }
    },
    container: {
        paddingBottom: theme.spacing(4)
    },
    paper: {
        padding: theme.spacing(1),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
    }
}));
