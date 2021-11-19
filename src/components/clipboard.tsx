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
import { Measurement } from '../contracts/measurementApi';
import { PasteOptions } from '../data/clipboard/contracts';
import { Skjema } from '../contracts/kontrollApi';
import { Theme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { makeStyles } from '../theme/makeStyles';
import { useClipBoard } from '../data/clipboard';

export const PasteTableButton = ({
    clipboardHas,
    options
}: PasteButtonProps) => {
    const { handlePaste } = useClipBoard();

    if (clipboardHas) {
        return (
            <Tooltip title="Lim inn valgte fra utklippstavle">
                <IconButton
                    color="warning"
                    onClick={() => handlePaste(options)}
                    aria-label="Lim inn valgte fra utklippstavle">
                    <ContentPasteIcon />
                </IconButton>
            </Tooltip>
        );
    }
    return <div />;
};
interface PasteButtonProps {
    clipboardHas: boolean | undefined;
    options: PasteOptions;
}
export const PasteButton = ({ clipboardHas, options }: PasteButtonProps) => {
    const { classes } = useStyles();
    const { handlePaste } = useClipBoard();

    if (clipboardHas) {
        return (
            <Tooltip title="Lim inn valgte fra utklippstavle">
                <Fab
                    color="secondary"
                    aria-label="Lim inn valgte fra utklippstavle"
                    onClick={() => handlePaste(options)}
                    className={classes.fab}>
                    <ContentPasteIcon />
                </Fab>
            </Tooltip>
        );
    }
    return <div />;
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
        state: { skjemaClipboard, skjemaToPast },
        setSkjemaerToPaste
    } = useClipBoard();

    const { classes } = useStyles();

    const handleToggle = (skjema: Skjema | undefined) => () => {
        if (skjema) {
            const currentIndex = skjemaToPast
                ? skjemaToPast.indexOf(skjema)
                : -1;
            const newChecked = skjemaToPast ? [...skjemaToPast] : [];

            if (currentIndex === -1) {
                newChecked.push(skjema);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setSkjemaerToPaste(newChecked);
        }
    };

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
                            <ListItemButton
                                role={undefined}
                                onClick={handleToggle(skjema)}
                                dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        tabIndex={-1}
                                        checked={
                                            skjemaToPast?.indexOf(skjema) !== -1
                                        }
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
export const MeasurementClipboard = () => {
    const {
        state: { measurementClipboard, measurementToPast },
        setMeasurementToPaste
    } = useClipBoard();

    const { classes } = useStyles();

    const handleToggle = (measurements: Measurement | undefined) => () => {
        if (measurements) {
            const currentIndex = measurementToPast
                ? measurementToPast.indexOf(measurements)
                : -1;
            const newChecked = measurementToPast ? [...measurementToPast] : [];

            if (currentIndex === -1) {
                newChecked.push(measurements);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setMeasurementToPaste(newChecked);
        }
    };

    return (
        <>
            <Typography
                variant="h3"
                gutterBottom
                component="h3"
                className={classes.title}>
                Målinger
            </Typography>
            <List>
                {measurementClipboard?.map((measurement) => {
                    const labelId = `checkbox-list-label-${measurement.id}`;

                    return (
                        <ListItem key={measurement.id} disablePadding>
                            <ListItemButton
                                role={undefined}
                                onClick={handleToggle(measurement)}
                                dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        tabIndex={-1}
                                        checked={
                                            measurementToPast?.indexOf(
                                                measurement
                                            ) !== -1
                                        }
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={` ${measurement.resultat} ${measurement.enhet}`}
                                    secondary={`${measurement.id} ${measurement.element}`}
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
