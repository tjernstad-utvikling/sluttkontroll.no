import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import logo from '../../assets/logoWhite.png';
import { useMainStyles } from '../../styles/layout/main';

interface LeftDrawerProps {
    isOpen: boolean;
}
export const LeftDrawer = ({ isOpen }: LeftDrawerProps) => {
    const classes = useMainStyles();
    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            color="primary"
            anchor="left"
            open={isOpen}
            classes={{
                paper: classes.drawerPaperClients
            }}>
            <div
                className={clsx(
                    classes.drawerHeader,
                    classes.drawerLogoHeader
                )}>
                <img src={logo} alt="" height={100} />
            </div>
            <Divider />
        </Drawer>
    );
};
