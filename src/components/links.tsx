import {
    NavLink as RouterLink,
    NavLinkProps as RouterLinkProps,
    useRouteMatch
} from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Omit } from '@material-ui/types';
import React from 'react';

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

export const ListItemLink = (props: ListItemLinkProps) => {
    const { icon, primary, to } = props;
    const match = useRouteMatch(to);

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
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
};
