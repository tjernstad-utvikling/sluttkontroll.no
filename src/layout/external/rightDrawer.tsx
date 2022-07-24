import { ListItemAction, ListItemLink } from '../../components/links';

import AddModeratorIcon from '@mui/icons-material/AddModerator';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentUser } from '../../api/hooks/useUsers';
import { useMainStyles } from '../../styles/layout/main';

interface RightDrawerProps {
    isOpen: boolean;
    toggle: () => void;
}

export const RightDrawer = ({ isOpen, toggle }: RightDrawerProps) => {
    const { classes } = useMainStyles();
    const { signOut } = useAuth();

    const handleSignOut = () => {
        signOut();
    };

    const currentUserData = useCurrentUser();

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
                    to="/external/profile"
                    primary={currentUserData.data?.name || 'Profil'}
                    icon={<PersonIcon />}
                />
            </List>
            <Divider />
            <List aria-label="hoved meny">
                <ListItemLink
                    to="/external/avvik"
                    primary="Dine avvik"
                    icon={<AddModeratorIcon />}
                />
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
