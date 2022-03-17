import { Klient, Location } from '../contracts/kontrollApi';
import React, { useEffect, useState } from 'react';
import {
    NavLink as RouterLink,
    NavLinkProps as RouterLinkProps
} from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { DistributiveOmit } from '@mui/types';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { PasteTableButton } from './clipboard';
import { Theme } from '@mui/material';
import { makeStyles } from '../theme/makeStyles';
import { useClipBoard } from '../data/clipboard';
import { useMainStyles } from '../styles/layout/main';

export const KlientMenu = ({
    searchString,
    klienter,
    isExternal
}: {
    searchString: string | undefined;
    klienter: Klient[] | undefined;
    isExternal: boolean;
}): JSX.Element => {
    const [filteredClients, setFilteredClients] = useState<Klient[]>();

    useEffect(() => {
        if (searchString && searchString.length > 2) {
            setFilteredClients(
                klienter?.filter((klient) => {
                    return (
                        klient.name
                            .toLowerCase()
                            .includes(searchString.toLowerCase()) ||
                        klient.locations.filter((location) =>
                            location.name
                                .toLowerCase()
                                .includes(searchString.toLowerCase())
                        ).length > 0
                    );
                })
            );
        } else {
            setFilteredClients(klienter);
        }
    }, [klienter, searchString]);

    if (filteredClients !== undefined) {
        return (
            <List aria-label="Kunder">
                {filteredClients.map((klient) => (
                    <KlientListItem
                        isExternal={isExternal}
                        klient={klient}
                        key={klient.id}
                        searchString={searchString}
                    />
                ))}
            </List>
        );
    }
    return <div></div>;
};

const useStyles = makeStyles()((theme: Theme) => ({
    nested: {
        paddingLeft: theme.spacing(4)
    }
}));

interface KlientListItemProps {
    klient: Klient;
    searchString: string | undefined;
    isExternal: boolean;
}
const KlientListItem = ({
    klient,
    searchString,
    isExternal
}: KlientListItemProps): JSX.Element => {
    const { classes } = useMainStyles();
    const [open, setOpen] = useState<boolean>(false);
    const handleClick = () => {
        setOpen(!open);
    };

    function filterLocations(locations: Location[]): Location[] {
        if (searchString) {
            return locations.filter((location) =>
                location.name.toLowerCase().includes(searchString.toLowerCase())
            );
        }
        return locations;
    }
    return (
        <div>
            <ListItem>
                <ListItemText
                    primaryTypographyProps={{ color: 'secondary' }}
                    primary={
                        <ItemLink
                            to={
                                isExternal
                                    ? `/external/client/${klient.id}`
                                    : `/kontroll/kl/${klient.id}`
                            }>
                            {klient.name}
                        </ItemLink>
                    }
                />

                {open ? (
                    <IconButton
                        color="inherit"
                        aria-label={`åpne lokasjoner for kunde ${klient.name}`}
                        onClick={handleClick}
                        size="large">
                        <ExpandLess color="secondary" />
                    </IconButton>
                ) : (
                    <IconButton
                        color="inherit"
                        aria-label={`åpne lokasjoner for kunde ${klient.name}`}
                        onClick={handleClick}
                        size="large">
                        <ExpandMore color="secondary" />
                    </IconButton>
                )}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List
                    className={classes.collapseListLeftDrawer}
                    component="div"
                    disablePadding>
                    {filterLocations(klient.locations).map((location) => {
                        if (isExternal)
                            return (
                                <ObjektListItem
                                    klientId={klient.id}
                                    id={location.id}
                                    name={location.name}
                                    key={location.id}
                                />
                            );

                        return (
                            <ObjektListItemWithPaste
                                klientId={klient.id}
                                id={location.id}
                                name={location.name}
                                key={location.id}
                            />
                        );
                    })}
                </List>
            </Collapse>
        </div>
    );
};

const ObjektListItem = ({
    name,
    id,
    klientId
}: {
    id: number;
    klientId: number;
    name: string;
}): JSX.Element => {
    const { classes } = useStyles();

    return (
        <ListItem button className={classes.nested}>
            <ListItemText
                primaryTypographyProps={{ color: 'secondary' }}
                primary={
                    <ItemLink
                        to={`/external/client/${klientId}/location/${id}`}>
                        {name}
                    </ItemLink>
                }
            />
        </ListItem>
    );
};

const ObjektListItemWithPaste = ({
    name,
    id,
    klientId
}: {
    id: number;
    klientId: number;
    name: string;
}): JSX.Element => {
    const { classes } = useStyles();
    const {
        state: { kontrollToPast },
        clipboardHasKontroll
    } = useClipBoard();
    return (
        <ListItem button className={classes.nested}>
            <ListItemText
                primaryTypographyProps={{ color: 'secondary' }}
                primary={
                    <ItemLink to={`/kontroll/kl/${klientId}/obj/${id}`}>
                        {name}
                    </ItemLink>
                }
            />
            {clipboardHasKontroll && (
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1A4D27' }}>
                        <PasteTableButton
                            clipboardHas={true}
                            options={{
                                kontrollPaste: {
                                    locationId: id,
                                    klientId: klientId,
                                    kontroll: kontrollToPast
                                }
                            }}
                        />
                    </Avatar>
                </ListItemAvatar>
            )}
        </ListItem>
    );
};

interface ListItemLinkProps {
    children: string;
    to: string;
}

export const ItemLink = ({ to, children }: ListItemLinkProps) => {
    const { classes } = useMainStyles();
    const renderLink = React.useMemo(
        () =>
            React.forwardRef<any, DistributiveOmit<RouterLinkProps, 'to'>>(
                (itemProps, ref) => (
                    <RouterLink to={to} ref={ref} {...itemProps} />
                )
            ),
        [to]
    );

    return (
        <Button
            className={classes.lefDrawerButton}
            component={renderLink}
            color="inherit">
            {children}
        </Button>
    );
};
