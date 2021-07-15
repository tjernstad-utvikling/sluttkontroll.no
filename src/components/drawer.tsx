import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Klient } from '../contracts/kontrollApi';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { useMainStyles } from '../styles/layout/main';

export const KlientMenu = (): JSX.Element => {
    const {
        state: { klienter },
        loadKlienter
    } = useKontroll();
    useEffectOnce(() => {
        loadKlienter();
    });

    if (klienter !== undefined) {
        return (
            <div>
                {klienter.map((klient) => (
                    <KlientListItem klient={klient} key={klient.id} />
                ))}
            </div>
        );
    }
    return <div></div>;
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        nested: {
            paddingLeft: theme.spacing(4)
        }
    })
);
interface KlientListItemProps {
    klient: Klient;
}
const KlientListItem = ({ klient }: KlientListItemProps): JSX.Element => {
    const classes = useMainStyles();
    const [open, setOpen] = useState<boolean>(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <div>
            <ListItem button onClick={handleClick}>
                <Link to="/kontroll/klient/9">test</Link>
                <ListItemText
                    primaryTypographyProps={{ color: 'secondary' }}
                    primary={klient.name}
                />
                {open ? (
                    <ExpandLess color="secondary" />
                ) : (
                    <ExpandMore color="secondary" />
                )}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List
                    className={classes.collapseListLeftDrawer}
                    component="div"
                    disablePadding>
                    {klient.objekts.map((objekt) => (
                        <ObjektListItem
                            id={objekt.id}
                            name={objekt.name}
                            key={objekt.id}
                        />
                    ))}
                </List>
            </Collapse>
        </div>
    );
};

const ObjektListItem = ({
    name
}: {
    id: number;
    name: string;
}): JSX.Element => {
    const classes = useStyles();
    return (
        <ListItem button className={classes.nested}>
            <ListItemText
                primaryTypographyProps={{ color: 'secondary' }}
                primary={name}
            />
        </ListItem>
    );
};
