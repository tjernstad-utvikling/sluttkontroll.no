import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import GroupIcon from '@material-ui/icons/Group';
import List from '@material-ui/core/List';
import { ListItemLink } from '../../components/links';
import { Roles } from '../../contracts/userApi';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import clsx from 'clsx';
import logo from '../../assets/logoWhite.png';
import { useAuth } from '../../hooks/useAuth';
import { useMainStyles } from '../../styles/layout/main';
interface LeftDrawerProps {
    isOpen: boolean;
}
export const LeftDrawer = ({ isOpen }: LeftDrawerProps) => {
    const classes = useMainStyles();
    const { userHasRole } = useAuth();
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
            <List aria-label="admin meny">
                <ListItemLink
                    to="/admin/users"
                    primary="Brukere"
                    icon={<GroupIcon />}
                    lightText
                />
                {userHasRole(Roles.ROLE_ADMIN) && (
                    <ListItemLink
                        to="/admin/settings/info-text"
                        primary="Rapport informasjonstekst"
                        icon={<TextFieldsIcon />}
                        lightText
                    />
                )}
            </List>
        </Drawer>
    );
};
