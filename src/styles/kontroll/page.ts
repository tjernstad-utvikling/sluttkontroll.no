import makeStyles from '@mui/styles/makeStyles';

export const usePageStyles = makeStyles((theme) => ({
    appBarSpacer: {
        padding: '1px'
    },
    container: {
        paddingBottom: '10px'
    },
    paper: {
        padding: '5px',
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
    }
}));
