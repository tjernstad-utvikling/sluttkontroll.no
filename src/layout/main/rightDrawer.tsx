import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { ListItemLink } from '../../components/links';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import { useMainStyles } from '../../styles/layout/main';

interface RightDrawerProps {
    isOpen: boolean;
    toggle: () => void;
}

export const RightDrawer = ({ isOpen, toggle }: RightDrawerProps) => {
    const classes = useMainStyles();
    return (
        <Drawer
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper
            }}
            anchor="right"
            open={isOpen}
            onClose={toggle}>
            <div className={classes.drawerHeader}>
                <IconButton
                    color="inherit"
                    aria-label="close drawer"
                    onClick={toggle}
                    className={classes.menuButton}>
                    <CloseIcon />
                </IconButton>
            </div>
            <Divider />
            <List aria-label="main mailbox folders">
                <ListItemLink
                    to="/kontroll"
                    primary="Kontroll"
                    icon={<LocationCityIcon />}
                />
            </List>
        </Drawer>
    );
};
