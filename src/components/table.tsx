import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import { useTable } from '../tables/tableContainer';

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
                                {columns.map((c) => (
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
                                            />
                                        }
                                        label={c.headerName}
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
