import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paper from '@mui/material/Paper';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
const PREFIX = 'Card';

const classes = {
    cardHeader: `${PREFIX}-cardHeader`,
    cardTitle: `${PREFIX}-cardTitle`,
    paper: `${PREFIX}-paper`,
    content: `${PREFIX}-content`
};

const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.cardHeader}`]: {
        background: theme.palette.primary.main
    },

    [`& .${classes.cardTitle}`]: {
        fontSize: '1.55rem!important',
        fontWeight: 500,
        color: '#ffffff'
    },

    [`& .${classes.paper}`]: {
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
    },

    [`& .${classes.content}`]: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2)
    }
}));

interface CardProps {
    children: React.ReactNode;
    title: string;
    menu?: React.ReactNode;
}
export const Card = ({ children, title, menu }: CardProps) => {


    return (
        <Paper className={classes.paper}>
            <Toolbar className={classes.cardHeader}>
                <Typography className={classes.cardTitle} variant="h2">
                    {title}
                </Typography>
                <Root style={{ flexGrow: 1 }} />
                {menu !== undefined ? menu : <div />}
            </Toolbar>
            {children}
        </Paper>
    );
};

interface CardMenuItem {
    label: string;
    action?: () => void;
    skip?: boolean;
    to?: string;
    icon?: React.ReactNode;
}
interface CardMenuProps {
    items: Array<CardMenuItem>;
    count?: number;
}
export const CardMenu = ({ items, count }: CardMenuProps) => {

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
                onClick={handleClick}
                size="large">
                <MoreVertIcon /> {count !== undefined && `(${count})`}
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                {items.map((ai) => {
                    if (ai.skip) {
                        return <div key={ai.label} />;
                    }
                    return (
                        <MenuItem key={ai.label}>
                            {ai.action !== undefined ? (
                                <Button
                                    onClick={() => {
                                        handleClose();
                                        if (ai.action !== undefined) {
                                            ai.action();
                                        }
                                    }}
                                    color="primary"
                                    startIcon={ai.icon}>
                                    {ai.label}
                                </Button>
                            ) : ai.to !== undefined ? (
                                <Button
                                    color="primary"
                                    component={RouterLink}
                                    to={ai.to}
                                    startIcon={ai.icon}>
                                    {ai.label}
                                </Button>
                            ) : (
                                <div />
                            )}
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {

    return <div className={classes.content}>{children}</div>;
};
