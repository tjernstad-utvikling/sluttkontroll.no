import {
    NavLink as RouterLink,
    NavLinkProps as RouterLinkProps,
    useRouteMatch
} from 'react-router-dom';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { Theme } from '@mui/material';
import clsx from 'clsx';
import { makeStyles } from '../theme/makeStyles';

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
    lightText?: boolean;
}

export const ListItemLink = (props: ListItemLinkProps) => {
    const { icon, primary, to } = props;
    const match = useRouteMatch(to);

    const { classes } = useStyles();

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<any, Omit<RouterLinkProps, 'to'>>(
                (itemProps, ref) => (
                    <RouterLink to={to} ref={ref} {...itemProps} />
                )
            ),
        [to]
    );

    return (
        <li>
            <ListItem selected={match !== null} button component={renderLink}>
                {icon ? (
                    <ListItemIcon
                        className={clsx({
                            [classes.icon]: props.lightText
                        })}>
                        {icon}
                    </ListItemIcon>
                ) : null}
                <ListItemText
                    className={clsx({
                        [classes.icon]: props.lightText
                    })}
                    primary={primary}
                />
            </ListItem>
        </li>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    icon: {
        color: '#fff'
    }
}));
