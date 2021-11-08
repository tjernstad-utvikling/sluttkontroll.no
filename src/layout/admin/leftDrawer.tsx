import BallotIcon from '@mui/icons-material/Ballot';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import GroupIcon from '@mui/icons-material/Group';
import List from '@mui/material/List';
import { ListItemLink } from '../../components/links';
import { Roles } from '../../contracts/userApi';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import clsx from 'clsx';
import logo from '../../assets/logoWhite.png';
import { useAuth } from '../../hooks/useAuth';
import { useMainStyles } from '../../styles/layout/main';

interface LeftDrawerProps {
    isOpen: boolean;
}
export const LeftDrawer = ({ isOpen }: LeftDrawerProps) => {
    const { classes } = useMainStyles();
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
                    <>
                        <ListItemLink
                            to="/admin/settings/info-text"
                            primary="Rapport informasjonstekst"
                            icon={<TextFieldsIcon />}
                            lightText
                        />
                        <ListItemLink
                            to="/admin/settings/template"
                            primary="Sjekkliste maler"
                            icon={<FormatListNumberedIcon />}
                            lightText
                        />
                        <ListItemLink
                            to="/admin/settings/checkpoint"
                            primary="Sjekkpunkter"
                            icon={<CheckCircleIcon />}
                            lightText
                        />
                        <ListItemLink
                            to="/admin/settings/forms"
                            primary="Risikovurderingsmaler"
                            icon={<BallotIcon />}
                            lightText
                        />
                    </>
                )}
            </List>
        </Drawer>
    );
};
