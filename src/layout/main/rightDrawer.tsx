import { ListItemAction, ListItemLink } from '../../components/links';

import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import GroupIcon from '@mui/icons-material/Group';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { Roles } from '../../contracts/userApi';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedIcon from '@mui/icons-material/Speed';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentUser } from '../../api/hooks/useUsers';
import { useMainStyles } from '../../styles/layout/main';

interface RightDrawerProps {
    isOpen: boolean;
    toggle: () => void;
}

export const RightDrawer = ({ isOpen, toggle }: RightDrawerProps) => {
    const { classes } = useMainStyles();
    const { userHasRole, signOut } = useAuth();

    const currentUserData = useCurrentUser();

    const handleSignOut = () => {
        signOut();
    };
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
                    className={classes.menuButton}
                    size="large">
                    <CloseIcon />
                </IconButton>
            </div>
            <Divider />
            <List aria-label="Bruker meny">
                <ListItemLink
                    to="/user"
                    primary={currentUserData.data?.name || 'Profil'}
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
                {userHasRole([Roles.ROLE_ADMIN]) && (
                    <ListItemLink
                        to="/admin/settings"
                        primary="Innstillinger"
                        icon={<SettingsIcon />}
                    />
                )}
            </List>
            <Divider />
            <List aria-label="Bruker meny">
                <ListItemAction
                    action={handleSignOut}
                    primary="Logg ut"
                    icon={<LockIcon />}
                />
            </List>
        </Drawer>
    );
};
