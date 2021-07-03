import { makeStyles } from '@material-ui/core/styles';

export const usePageStyles = makeStyles((theme) => ({
    appBarSpacer: theme.mixins.toolbar,
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
