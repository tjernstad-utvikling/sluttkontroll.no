import {
    NavLink as RouterLink,
    NavLinkProps as RouterLinkProps,
    useRouteMatch
} from 'react-router-dom';

import ListItemButton from '@mui/material/ListItemButton';
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
            <ListItemButton selected={match !== null} component={renderLink}>
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
            </ListItemButton>
        </li>
    );
};
interface ListItemActionProps {
    icon?: React.ReactElement;
    primary: string;
    action: () => void;
    lightText?: boolean;
}

export const ListItemAction = (props: ListItemActionProps) => {
    const { icon, primary, action } = props;
    const { classes } = useStyles();

    return (
        <li>
            <ListItemButton onClick={action}>
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
            </ListItemButton>
        </li>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    icon: {
        color: '#fff'
    }
}));
