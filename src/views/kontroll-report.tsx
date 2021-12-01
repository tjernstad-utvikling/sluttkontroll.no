import {
    Block,
    ReportPropertiesViewer,
    ReportSwitch
} from '../components/report';
import { Card, CardContent } from '../components/card';
import {
    DocumentContainer,
    ReportModules
} from '../document/documentContainer';
import {
    FrontPageAdjusting,
    KontrollDocAdjusting,
    MeasurementAdjusting,
    ReportProperties
} from '../document/customizeData/kontrollReportData';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { KontrollReportViewParams } from '../contracts/navigation';
import { SlkReport } from '../document/report';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';

const KontrollReportView = () => {
    const { classes } = usePageStyles();
    const { kontrollId, objectId } = useParams<KontrollReportViewParams>();

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <DocumentContainer
                    reportTypeId="kontroll"
                    kontrollId={Number(kontrollId)}
                    objectId={Number(objectId)}>
                    <ReportPropertiesViewer>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={8}>
                                <Card title="Kontroll rapport">
                                    <CardContent>
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
                                            <ReportProperties />
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                            <ReportSwitch
                                                id={ReportModules.statementPage}
                                                label="Generell vurdering"
                                            />
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                            <ReportSwitch
                                                id={ReportModules.controlModule}
                                                label="Kontrolldokumentasjon"
                                            />

                                            <KontrollDocAdjusting
                                                kontrollId={Number(kontrollId)}
                                            />
                                        </div>
                                        <Block
                                            dependency={
                                                ReportModules.controlModule
                                            }>
                                            <div style={{ paddingLeft: 30 }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between'
                                                    }}>
                                                    <ReportSwitch
                                                        id={
                                                            ReportModules.skjemaPage
                                                        }
                                                        label="KontrollSkjema"
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between'
                                                    }}>
                                                    <ReportSwitch
                                                        id={
                                                            ReportModules.measurementPage
                                                        }
                                                        label="Måleprotokoll"
                                                    />
                                                    <MeasurementAdjusting />
                                                </div>
                                            </div>
                                        </Block>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <SlkReport />
                            </Grid>
                        </Grid>
                    </ReportPropertiesViewer>
                </DocumentContainer>
            </Container>
        </div>
    );
};

export default KontrollReportView;
