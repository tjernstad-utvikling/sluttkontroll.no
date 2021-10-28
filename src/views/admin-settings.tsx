import { Card, CardContent } from '../components/card';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { SettingCard } from '../components/settings';
import { Theme } from '@mui/material';
import logo from '../../assets/logoWhite.png';
import { makeStyles } from '../theme/makeStyles';
import { usePageStyles } from '../styles/kontroll/page';

const SettingsView = () => {
    const { classes } = usePageStyles();

    const { classes: classes2 } = useStyles();

    return (
        <>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Innstillinger">
                            <CardContent>
                                <div className={classes2.container}>
                                    <SettingCard
                                        to="/test1"
                                        image={logo}
                                        title="Test setting 1"
                                    />
                                    <SettingCard
                                        to="/test2"
                                        image={logo}
                                        title="Test setting 2"
                                    />
                                    <SettingCard
                                        to="/test3"
                                        image={logo}
                                        title="Test setting 3"
                                    />
                                    <SettingCard
                                        to="/test4"
                                        image={logo}
                                        title="Test setting 4"
                                    />
                                    <SettingCard
                                        to="/test5"
                                        image={logo}
                                        title="Test setting 5"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SettingsView;

const useStyles = makeStyles()((theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    }
}));
