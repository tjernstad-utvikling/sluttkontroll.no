import React, { useEffect, useState } from 'react';
import {
    NavLink as RouterLink,
    NavLinkProps as RouterLinkProps
} from 'react-router-dom';

import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { DistributiveOmit } from '@mui/types';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { Klient } from '../contracts/kontrollApi';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from '@mui/material';
import { makeStyles } from '../theme/makeStyles';
import { useClient } from '../data/klient';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useMainStyles } from '../styles/layout/main';

export const KlientMenu = ({
    searchString
}: {
    searchString: string | undefined;
}): JSX.Element => {
    const {
        state: { klienter },
        loadKlienter
    } = useClient();
    useEffectOnce(() => {
        loadKlienter();
    });

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
            <List aria-label="Klienter">
                {filteredClients.map((klient) => (
                    <KlientListItem klient={klient} key={klient.id} />
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
}
const KlientListItem = ({ klient }: KlientListItemProps): JSX.Element => {
    const { classes } = useMainStyles();
    const [open, setOpen] = useState<boolean>(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <div>
            <ListItem>
                <ListItemText
                    primaryTypographyProps={{ color: 'secondary' }}
                    primary={
                        <ItemLink to={`/kontroll/kl/${klient.id}`}>
                            {klient.name}
                        </ItemLink>
                    }
                />

                {open ? (
                    <IconButton
                        color="inherit"
                        aria-label={`åpne lokasjoner for klient ${klient.name}`}
                        onClick={handleClick}
                        size="large">
                        <ExpandLess color="secondary" />
                    </IconButton>
                ) : (
                    <IconButton
                        color="inherit"
                        aria-label={`åpne lokasjoner for klient ${klient.name}`}
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
                    {klient.locations.map((location) => (
                        <ObjektListItem
                            klientId={klient.id}
                            id={location.id}
                            name={location.name}
                            key={location.id}
                        />
                    ))}
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
                    <ItemLink to={`/kontroll/kl/${klientId}/obj/${id}`}>
                        {name}
                    </ItemLink>
                }
            />
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
