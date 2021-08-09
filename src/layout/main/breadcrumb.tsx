import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import GrainIcon from '@material-ui/icons/Grain';
import HomeIcon from '@material-ui/icons/Home';
import Link from '@material-ui/core/Link';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import WhatshotIcon from '@material-ui/icons/Whatshot';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        link: {
            display: 'flex'
        },
        icon: {
            marginRight: theme.spacing(0.5),
            width: 20,
            height: 20
        }
    })
);

function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export function Breadcrumbs() {
    const classes = useStyles();

    return (
        <MuiBreadcrumbs aria-label="breadcrumb">
            <Link
                color="inherit"
                href="/"
                onClick={handleClick}
                className={classes.link}>
                <HomeIcon className={classes.icon} />
                Material-UI
            </Link>
            <Link
                color="inherit"
                href="/getting-started/installation/"
                onClick={handleClick}
                className={classes.link}>
                <WhatshotIcon className={classes.icon} />
                Core
            </Link>
            <Typography color="textPrimary" className={classes.link}>
                <GrainIcon className={classes.icon} />
                Breadcrumb
            </Typography>
        </MuiBreadcrumbs>
    );
}
