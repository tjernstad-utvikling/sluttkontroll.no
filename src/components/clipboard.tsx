import { Card, CardContent } from '../components/card';

import Checkbox from '@mui/material/Checkbox';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { makeStyles } from '../theme/makeStyles';
import { useClipBoard } from '../data/clipboard';

export const PasteSmallButton = () => {
    return (
        <Tooltip title="Lim inn valgte fra utklippstavle">
            <IconButton
                color="primary"
                aria-label="Lim inn valgte fra utklippstavle">
                <ContentPasteIcon />
            </IconButton>
        </Tooltip>
    );
};
export const PasteButton = () => {
    const { classes } = useStyles();
    return (
        <Tooltip title="Lim inn valgte fra utklippstavle">
            <Fab
                color="secondary"
                aria-label="Lim inn valgte fra utklippstavle"
                className={classes.fab}>
                <ContentPasteIcon />
            </Fab>
        </Tooltip>
    );
};
export const ClipboardCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <Grid item xs={3}>
            <Card title="Utklippstavle">
                <CardContent>{children}</CardContent>
            </Card>
        </Grid>
    );
};

export const SkjemaClipboard = () => {
    const {
        state: { skjemaClipboard }
    } = useClipBoard();

    const { classes } = useStyles();

    return (
        <>
            <Typography
                variant="h3"
                gutterBottom
                component="h3"
                className={classes.title}>
                Skjemaer
            </Typography>
            <List>
                {skjemaClipboard?.map((skjema) => {
                    const labelId = `checkbox-list-label-${skjema.id}`;

                    return (
                        <ListItem key={skjema.id} disablePadding>
                            <ListItemButton role={undefined} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={skjema.area}
                                    secondary={skjema.omrade}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
};

const useStyles = makeStyles()((theme: Theme) => ({
    title: {
        fontSize: '1.3rem!important',
        fontWeight: 500
    },
    fab: {}
}));
