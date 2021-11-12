import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
import { useTable } from './tableContainer';

export const ColumnSelect = (): JSX.Element => {
    const [open, setOpen] = React.useState(false);
    const { columns, toggleColumn } = useTable();

    return (
        <>
            <Button
                style={{ margin: '10px', marginLeft: 0 }}
                variant="contained"
                color="info"
                onClick={() => setOpen(true)}>
                Velg kolonner
            </Button>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
                maxWidth="xs"
                open={open}
                onClose={() => setOpen(false)}>
                <DialogTitle>Velg kolonner</DialogTitle>
                <DialogContent dividers>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Velg kolonner</FormLabel>
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
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)}>
                        lukk
                    </Button>
                </DialogActions>
            </Dialog>
        </>
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
