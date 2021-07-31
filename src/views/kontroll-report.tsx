import {
    DocumentContainer,
    ReportModules
} from '../document/documentContainer';
import { ReportSwitch, ReportViewer } from '../components/report';

import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import { FrontPageAdjusting } from '../document/customizeData/kontrollReportData';
import Grid from '@material-ui/core/Grid';
import { KontrollReportViewParams } from '../contracts/navigation';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';

const KontrollReportView = () => {
    const classes = usePageStyles();
    const { kontrollId, objectId } = useParams<KontrollReportViewParams>();

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <DocumentContainer
                    reportTypeId="kontroll"
                    kontrollId={Number(kontrollId)}
                    objectId={Number(objectId)}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={8}>
                            <Card title="Kontroll rapport">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                    <ReportSwitch
                                        id={ReportModules.frontPage}
                                        label="Forside"
                                    />

                                    <FrontPageAdjusting />
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                    <ReportSwitch
                                        id={ReportModules.infoPage}
                                        label="Infoside"
                                    />
                                    {/*
                                    <FrontPageAdjusting /> */}
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                    <ReportSwitch
                                        id={ReportModules.skjemaPage}
                                        label="Kontrolldokumentasjon"
                                    />
                                    {/*
                                    <FrontPageAdjusting /> */}
                                </div>
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
