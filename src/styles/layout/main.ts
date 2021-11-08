import { Theme } from '@mui/material';
import { makeStyles } from '../../theme/makeStyles';

export const useMainStyles = makeStyles()((theme: Theme) => ({
    root: {
        display: 'flex'
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)!important`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    toolbarContainer: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    lefDrawerButton: {
        '&.active': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }
    },
    drawerPaperClients: {
        width: drawerWidth,
        backgroundColor: theme.palette.primary.main
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        minHeight: 56,
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
            minHeight: 48
        },
        [theme.breakpoints.up('sm')]: {
            minHeight: 64
        },
        justifyContent: 'flex-end'
    },
    drawerLogoHeader: {
        justifyContent: 'center',
        height: 150,
        minHeight: 150
    },
    collapseListLeftDrawer: {
        backgroundColor: theme.palette.primary.dark
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
        paddingTop: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: -drawerWidth
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    }
}));

const drawerWidth = 300;
