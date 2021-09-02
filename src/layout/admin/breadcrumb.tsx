import {
    KontrollKlientViewParams,
    KontrollObjectViewParams,
    SjekklisterViewParams,
    SkjemaerViewParams
} from '../../contracts/navigation';
import React, { useMemo } from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import HomeIcon from '@material-ui/icons/Home';
import Link from '@material-ui/core/Link';
import ListIcon from '@material-ui/icons/List';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import Typography from '@material-ui/core/Typography';
import { useClient } from '../../data/klient';
import { useKontroll } from '../../data/kontroll';

export function KontrollBreadcrumbs() {
    const pages = [
        { getter: YourControl },
        { getter: Client },
        { getter: Location },
        { getter: Control },
        { getter: Skjema }
    ];
    const breadcrumbs: JSX.Element[] = [];

    pages.forEach((p) => {
        const res = p.getter();
        if (res !== undefined) {
            breadcrumbs.push(res);
        }
    });
    return (
        <MuiBreadcrumbs aria-label="breadcrumb">
            {breadcrumbs.map((br) => br)}
        </MuiBreadcrumbs>
    );
}

const YourControl = () => {
    const classes = useStyles();

    const match = useRouteMatch('/kontroll');
    if (match !== null && match.isExact) {
        return (
            <Breadcrumb key={match.path} to="/kontroll" isExact={match.isExact}>
                <HomeIcon className={classes.icon} />
                Dine kontroller
            </Breadcrumb>
        );
    }
    return undefined;
};

const Client = () => {
    const classes = useStyles();
    const {
        state: { klienter }
    } = useClient();
    const match = useRouteMatch<KontrollKlientViewParams>(
        '/kontroll/kl/:klientId'
    );

    const klient = useMemo(() => {
        return klienter?.find((k) => k.id === Number(match?.params.klientId));
    }, [klienter, match?.params.klientId]);

    if (match !== null && klient !== undefined) {
        return (
            <Breadcrumb key={match.path} to={match.url} isExact={match.isExact}>
                <BusinessCenterIcon className={classes.icon} />
                {klient.name}
            </Breadcrumb>
        );
    }
    return undefined;
};
const Location = () => {
    const classes = useStyles();
    const {
        state: { klienter }
    } = useClient();
    const match = useRouteMatch<KontrollObjectViewParams>(
        '/kontroll/kl/:klientId/obj/:objectId'
    );
    const location = useMemo(() => {
        const klient = klienter?.find(
            (k) => k.id === Number(match?.params.klientId)
        );
        return klient?.objekts.find(
            (l) => l.id === Number(match?.params.objectId)
        );
    }, [klienter, match?.params.klientId, match?.params.objectId]);

    if (match !== null && location !== undefined) {
        return (
            <Breadcrumb key={match.path} to={match.url} isExact={match.isExact}>
                <LocationOnIcon className={classes.icon} />
                {location.name}
            </Breadcrumb>
        );
    }
    return undefined;
};

const Control = () => {
    const classes = useStyles();
    const {
        state: { kontroller }
    } = useKontroll();
    const match = useRouteMatch<SkjemaerViewParams>(
        '/kontroll/kl/:klientId/obj/:objectId/:kontrollId'
    );

    const kontroll = useMemo(() => {
        return kontroller?.find(
            (k) => k.id === Number(match?.params.kontrollId)
        );
    }, [kontroller, match?.params.kontrollId]);

    if (match !== null && kontroll !== undefined) {
        return (
            <Breadcrumb key={match.path} to={match.url} isExact={match.isExact}>
                <PlaylistAddCheckIcon className={classes.icon} />
                {kontroll.name}
            </Breadcrumb>
        );
    }
    return undefined;
};

const Skjema = () => {
    const classes = useStyles();
    const {
        state: { skjemaer }
    } = useKontroll();
    const match = useRouteMatch<SjekklisterViewParams>(
        '/kontroll/kl/:klientId/obj/:objectId/:kontrollId/skjema/:skjemaId'
    );

    const skjema = useMemo(() => {
        return skjemaer?.find((s) => s.id === Number(match?.params.skjemaId));
    }, [skjemaer, match?.params.skjemaId]);

    if (match !== null && skjema !== undefined) {
        return (
            <Breadcrumb key={match.path} to={match.url} isExact={match.isExact}>
                <ListIcon className={classes.icon} />
                {skjema.area} - {skjema.omrade}
            </Breadcrumb>
        );
    }
    return undefined;
};

interface BreadcrumbProps {
    isExact: boolean;
    children: React.ReactNode;
    to: string;
}
const Breadcrumb = ({
    isExact,
    children,
    to
}: BreadcrumbProps): JSX.Element => {
    const classes = useStyles();
    if (isExact) {
        return (
            <Typography color="textPrimary" className={classes.link}>
                {children}
            </Typography>
        );
    }
    return (
        <Link
            color="inherit"
            className={classes.link}
            component={RouterLink}
            to={to}>
            {children}
        </Link>
    );
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
