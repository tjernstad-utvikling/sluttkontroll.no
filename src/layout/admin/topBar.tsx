import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { useMainStyles } from '../../styles/layout/main';

interface TopBarProps {
    isOpenLeftDrawerOpen: boolean;
    toggleLeftDrawer: () => void;
    toggleRightDrawer: () => void;
    module: 'users';
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
                    className={classes.menuButton}
                    size="large">
                    <MenuIcon />
                </IconButton>

                <div className={classes.toolbarContainer}></div>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleRightDrawer}
                    className={classes.menuButton}
                    size="large">
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
