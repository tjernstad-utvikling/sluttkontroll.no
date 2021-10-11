import {
    NavLink as RouterLink,
    NavLinkProps as RouterLinkProps,
    useRouteMatch
} from 'react-router-dom';

import { styled } from '@mui/material/styles';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { DistributiveOmit } from '@mui/types';
import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';

const PREFIX = 'ListItemLink';

const classes = {
    icon: `${PREFIX}-icon`
};

const Root = styled('li')({
    [`& .${classes.icon}`]: {
        color: '#fff'
    }
});

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
    lightText?: boolean;
}

export const ListItemLink = (props: ListItemLinkProps) => {
    const { icon, primary, to } = props;
    const match = useRouteMatch(to);



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
        <Root>
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
        </Root>
    );
};
