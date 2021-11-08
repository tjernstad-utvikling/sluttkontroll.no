import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { useTable } from './tableContainer';

export const ColumnSelect = (): JSX.Element => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const { columns, toggleColumn } = useTable();

    const handleClick = () => {
        setOpen((prev) => !prev);
    };

    const handleClickAway = () => {
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className={classes.root}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClick}>
                    Velg kolonner
                </Button>
                {open ? (
                    <div className={classes.dropdown}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">
                                Velg kolonner
                            </FormLabel>
                            <FormGroup>
                                {columns
                                    .filter(
                                        (c) =>
                                            c.field !== '__HIDDEN__' &&
                                            c.field !== 'action'
                                    )
                                    .map((c) => (
                                        <FormControlLabel
                                            key={c.field}
                                            control={
                                                <Switch
                                                    checked={!c.hide}
                                                    onChange={() =>
                                                        toggleColumn(c.field)
                                                    }
                                                    name={c.headerName}
                                                    color="primary"
                                                    size="small"
                                                />
                                            }
                                            label={c.headerName || ''}
                                        />
                                    ))}
                            </FormGroup>
                        </FormControl>
                        {}
                    </div>
                ) : null}
            </div>
        </ClickAwayListener>
    );
};

export interface ActionItem {
    name: string;
    action?: () => void;
    to?: string;
    skip?: boolean;
    icon?: React.ReactNode;
}
interface RowActionProps {
    actionItems: Array<ActionItem>;
}
export const RowAction = ({ actionItems }: RowActionProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const close = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="open menu"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                size="large">
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={close}>
                {actionItems.map((ai) => {
                    if (ai.skip) {
                        return <div key={ai.name} />;
                    }
                    return (
                        <MenuItem key={ai.name}>
                            {ai.action !== undefined ? (
                                <Button
                                    onClick={() => {
                                        close();
                                        if (ai.action !== undefined) {
                                            ai.action();
                                        }
                                    }}
                                    color="primary"
                                    startIcon={ai.icon}>
                                    {ai.name}
                                </Button>
                            ) : ai.to !== undefined ? (
                                <Button
                                    color="primary"
                                    component={RouterLink}
                                    to={ai.to}
                                    startIcon={ai.icon}>
                                    {ai.name}
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'relative'
        },
        dropdown: {
            position: 'absolute',
            top: 28,
            right: 0,
            left: 0,
            zIndex: 1,
            width: 300,
            border: '1px solid',
            padding: theme.spacing(1),
            backgroundColor: theme.palette.background.paper
        }
    })
);
