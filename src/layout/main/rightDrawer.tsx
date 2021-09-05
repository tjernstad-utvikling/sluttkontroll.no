import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import GroupIcon from '@material-ui/icons/Group';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { ListItemLink } from '../../components/links';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import PersonIcon from '@material-ui/icons/Person';
import { Roles } from '../../contracts/userApi';
import SettingsIcon from '@material-ui/icons/Settings';
import SpeedIcon from '@material-ui/icons/Speed';
import { useAuth } from '../../hooks/useAuth';
import { useMainStyles } from '../../styles/layout/main';
interface RightDrawerProps {
    isOpen: boolean;
    toggle: () => void;
}

export const RightDrawer = ({ isOpen, toggle }: RightDrawerProps) => {
    const classes = useMainStyles();
    const { user, userHasRole } = useAuth();

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
            <List aria-label="Bruker meny">
                <ListItemLink
                    to="/user"
                    primary={user?.name || 'Profil'}
                    icon={<PersonIcon />}
                />
            </List>
            <Divider />
            <List aria-label="hoved meny">
                <ListItemLink
                    to="/kontroll"
                    primary="Kontroll"
                    icon={<LocationCityIcon />}
                />
                <ListItemLink
                    to="/instrument"
                    primary="Instrumenter"
                    icon={<SpeedIcon />}
                />
                <ListItemLink
                    to="/forms"
                    primary="Risikovurderinger"
                    icon={<FormatAlignCenterIcon />}
                />
            </List>
            <Divider />
            <List aria-label="admin meny">
                <ListItemLink
                    to="/admin/users"
                    primary="Brukere"
                    icon={<GroupIcon />}
                />
                {userHasRole(Roles.ROLE_ADMIN) && (
                    <ListItemLink
                        to="/admin/settings"
                        primary="Innstillinger"
                        icon={<SettingsIcon />}
                    />
                )}
            </List>
        </Drawer>
    );
};
