import { Card, CardContent } from '../components/card';

import Checkbox from '@mui/material/Checkbox';
import CommentIcon from '@mui/icons-material/Comment';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useClipBoard } from '../data/clipboard';

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
    return (
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
                                    inputProps={{ 'aria-labelledby': labelId }}
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
    );
};
