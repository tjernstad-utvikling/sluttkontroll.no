import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import { KontrollBreadcrumbs } from './breadcrumb';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import { useMainStyles } from '../../styles/layout/main';

interface TopBarProps {
    isOpenLeftDrawerOpen: boolean;
    toggleLeftDrawer: () => void;
    toggleRightDrawer: () => void;
    module: 'kontroll' | 'instrument';
}
export const TopBar = ({
    isOpenLeftDrawerOpen,
    toggleLeftDrawer,
    toggleRightDrawer,
    module
}: TopBarProps) => {
    const classes = useMainStyles();
    return (
        <AppBar
            position="fixed"
            color="secondary"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: isOpenLeftDrawerOpen
            })}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleLeftDrawer}
                    edge="start"
                    className={classes.menuButton}>
                    <MenuIcon />
                </IconButton>
                {module === 'kontroll' && <KontrollBreadcrumbs />}
                <div className={classes.toolbarContainer}></div>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleRightDrawer}
                    className={classes.menuButton}>
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
