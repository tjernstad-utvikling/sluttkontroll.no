import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

interface CardProps {
    children: React.ReactNode;
    title: string;
    menu?: React.ReactNode;
}
export const Card = ({ children, title, menu }: CardProps) => {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Toolbar className={classes.cardHeader}>
                <Typography className={classes.cardTitle} variant="h2">
                    {title}
                </Typography>
                <div style={{ flexGrow: 1 }} />
                {menu !== undefined ? menu : <div />}
            </Toolbar>
            {children}
        </Paper>
    );
};

interface CardMenuItem {
    label: string;
    action: () => void;
}
interface CardMenuProps {
    items: Array<CardMenuItem>;
}
export const CardMenu = ({ items }: CardMenuProps) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                className={classes.cardTitle}
                aria-label="open menu"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onMouseOver={handleClick}
                onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                {items.map((item) => (
                    <MenuItem key={item.label} onClick={item.action}>
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    cardHeader: {
        background: theme.palette.primary.main
    },
    cardTitle: {
        fontSize: '1.55rem!important',
        fontWeight: 500,
        color: '#ffffff'
    },
    paper: {
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
    }
}));
