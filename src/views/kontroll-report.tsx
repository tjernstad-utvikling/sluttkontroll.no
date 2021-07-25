import {
    DocumentContainer,
    ReportModules
} from '../document/documentContainer';
import { ReportSwitch, ReportViewer } from '../components/report';

import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { usePageStyles } from '../styles/kontroll/page';

const KontrollReportView = () => {
    const classes = usePageStyles();

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <DocumentContainer reportTypeId="kontroll">
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={8}>
                            <Card title="Kontroll rapport">
                                <ReportSwitch
                                    id={ReportModules.frontPage}
                                    label="Forside"
                                />
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <ReportViewer />
                        </Grid>
                    </Grid>
                </DocumentContainer>
            </Container>
        </div>
    );
};

export default KontrollReportView;
