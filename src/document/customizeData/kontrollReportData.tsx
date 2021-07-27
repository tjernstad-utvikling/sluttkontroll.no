import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { useReport } from '../documentContainer';
import { useState } from 'react';

export const FrontPageAdjusting = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { frontPageData, setFrontPageData } = useReport();
    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpen(!open)}>
                Tilpass
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Tilpass fremside
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Framside er fylt ut med standard tittel, den kan endres
                        her
                    </DialogContentText>
                    {frontPageData !== undefined && (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                            value={frontPageData.title}
                            onChange={(e) =>
                                setFrontPageData({
                                    ...frontPageData,
                                    title: e.target.value
                                })
                            }
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Lukk
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
