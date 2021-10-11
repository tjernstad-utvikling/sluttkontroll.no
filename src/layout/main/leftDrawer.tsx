import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import { KlientMenu } from '../../components/drawer';
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
            <KlientMenu />
        </Drawer>
    );
};
