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

export const CardMenu = () => {
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
                aria-label="open menu"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    cardHeader: {
        background: theme.palette.primary.main
    },
    cardTitle: {
        fontSize: '1.75rem!important',
        fontWeight: 500
    },
    paper: {
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
    }
}));
