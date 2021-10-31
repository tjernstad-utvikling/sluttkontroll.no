import { Card, CardContent } from '../components/card';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { SettingCard } from '../components/settings';
import { Theme } from '@mui/material';
import accountMultiple from '../assets/account-multiple.svg';
import ballot from '../assets/ballot.svg';
import checkCircle from '../assets/check-circle.svg';
import formatListNumbered from '../assets/format-list-numbered.svg';
import formatText from '../assets/format-text.svg';
import { makeStyles } from '../theme/makeStyles';
import { usePageStyles } from '../styles/kontroll/page';
import { useRouteMatch } from 'react-router';

const SettingsView = () => {
    const { classes } = usePageStyles();
    const { classes: classes2 } = useStyles();
    const { url } = useRouteMatch();

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
                                        to="/admin/users"
                                        image={accountMultiple}
                                        title="Brukere"
                                    />
                                    <SettingCard
                                        to={`${url}/info-text`}
                                        image={formatText}
                                        title="Rapport informasjonstekst"
                                    />
                                    <SettingCard
                                        to={`${url}/template`}
                                        image={formatListNumbered}
                                        title="Sjekkliste maler"
                                    />
                                    <SettingCard
                                        to={`${url}/checkpoint`}
                                        image={checkCircle}
                                        title="Sjekkpunkter"
                                    />
                                    <SettingCard
                                        to={`${url}/forms`}
                                        image={ballot}
                                        title="Risikovurderingsmaler"
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
