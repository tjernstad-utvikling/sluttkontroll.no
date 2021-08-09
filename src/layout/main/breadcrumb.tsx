import React, { useMemo } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { match, useRouteMatch } from 'react-router-dom';

import AddLocationIcon from '@material-ui/icons/AddLocation';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import GrainIcon from '@material-ui/icons/Grain';
import HomeIcon from '@material-ui/icons/Home';
import { KontrollKlientViewParams } from '../../contracts/navigation';
import Link from '@material-ui/core/Link';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import { useKontroll } from '../../data/kontroll';

function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export function Breadcrumbs() {
    return (
        <>
            <YourControlBreadCrumb />
            <ControlClientBreadCrumb />
            {/*
            <Link
                color="inherit"
                href="/getting-started/installation/"
                onClick={handleClick}
                className={classes.link}>
                <WhatshotIcon className={classes.icon} />
                Core
            </Link>
            {breadCrumbs} */}
        </>
    );
}

const YourControlBreadCrumb = () => {
    const classes = useStyles();

    const match = useRouteMatch('/kontroll');
    if (match !== null) {
        console.log({ match });
        if (match.isExact) {
            return (
                <MuiBreadcrumbs aria-label="breadcrumb">
                    <Typography color="textPrimary" className={classes.link}>
                        <LocationCityIcon className={classes.icon} />
                        Dine kontroller
                    </Typography>
                </MuiBreadcrumbs>
            );
        }
    }
    return <div />;
};
const ControlClientBreadCrumb = () => {
    const classes = useStyles();
    const {
        state: { klienter }
    } = useKontroll();

    const match = useRouteMatch<KontrollKlientViewParams>(
        '/kontroll/kl/:klientId'
    );

    const klient = useMemo(() => {
        return klienter?.find((k) => k.id === Number(match?.params.klientId));
    }, [klienter, match?.params.klientId]);

    if (match !== null && klient !== undefined) {
        console.log({ match });
        if (match.isExact) {
            return (
                <MuiBreadcrumbs aria-label="breadcrumb">
                    <Typography color="textPrimary" className={classes.link}>
                        <LocationCityIcon className={classes.icon} />
                        {klient.name}
                    </Typography>
                </MuiBreadcrumbs>
            );
        }
    }
    return <div />;
};

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
