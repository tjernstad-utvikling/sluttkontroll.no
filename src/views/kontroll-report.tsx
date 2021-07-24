import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import { DocumentContainer } from '../document/documentContainer';
import Grid from '@material-ui/core/Grid';
import { PDFViewer } from '@react-pdf/renderer';
import { Report } from '../document/report';
import { ReportSwitch } from '../components/report';
import { usePageStyles } from '../styles/kontroll/page';
import { useWindowSize } from '../hooks/useWindowSize';

const KontrollReportView = () => {
    const classes = usePageStyles();

    const size = useWindowSize();

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <DocumentContainer reportTypeId="kontroll">
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={8}>
                            <Card title="Kontroll rapport">
                                <ReportSwitch id="frontPage" label="Forside" />
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <PDFViewer height={size.height - 120}>
                                <Report />
                            </PDFViewer>
                        </Grid>
                    </Grid>
                </DocumentContainer>
            </Container>
        </div>
    );
};

export default KontrollReportView;
