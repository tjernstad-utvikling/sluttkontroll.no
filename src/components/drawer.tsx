import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Klient } from '../contracts/kontrollApi';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';

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
    const [open, setOpen] = useState<boolean>(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <div>
            <ListItem button onClick={handleClick}>
                <ListItemText primary={klient.name} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
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
            <ListItemText primary={name} />
        </ListItem>
    );
};
