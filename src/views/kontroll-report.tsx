import {
    Block,
    ReportPropertiesViewer,
    ReportSwitch
} from '../components/report';
import { Card, CardContent } from '../components/card';
import {
    FrontPageAdjusting,
    KontrollDocAdjusting,
    MeasurementAdjusting,
    ReportProperties,
    ReportStatement,
    SelectAttachments,
    SelectInstruments
} from '../report/data/kontrollReportData';

import Container from '@mui/material/Container';
import { DocumentContainer } from '../report/documentContainer';
import Grid from '@mui/material/Grid';
import { KontrollReportViewParams } from '../contracts/navigation';
import { ReportModules } from '../contracts/reportApi';
import { SlkReport } from '../report/document/report';
import { usePageStyles } from '../styles/kontroll/page';
import { useParams } from 'react-router-dom';

const KontrollReportView = () => {
    const { classes } = usePageStyles();
    const { kontrollId } = useParams<KontrollReportViewParams>();

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <DocumentContainer kontrollId={Number(kontrollId)}>
                    <ReportPropertiesViewer>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Card title="Kontroll rapport">
                                    <CardContent>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                            <ReportSwitch
                                                id={ReportModules.frontPage}
                                                label="Framside"
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
                                        <Block
                                            dependency={ReportModules.infoPage}>
                                            <div style={{ paddingLeft: 30 }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between'
                                                    }}>
                                                    <ReportSwitch
                                                        id={
                                                            ReportModules.clientModule
                                                        }
                                                        label="Inspeksjonssted"
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
                                                            ReportModules.controllerModule
                                                        }
                                                        label="Kontrollert av"
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
                                                            ReportModules.infoModule
                                                        }
                                                        label="Generell informasjon om kontroll"
                                                    />
                                                </div>
                                            </div>
                                        </Block>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                            <ReportSwitch
                                                id={ReportModules.statementPage}
                                                label="Rapport hoveddel"
                                            />
                                        </div>
                                        <Block
                                            dependency={
                                                ReportModules.statementPage
                                            }>
                                            <div
                                                style={{
                                                    paddingLeft: 30
                                                }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'space-between'
                                                    }}>
                                                    <ReportSwitch
                                                        id={
                                                            ReportModules.statementModule
                                                        }
                                                        label="Generell vurdering"
                                                    />
                                                    <ReportStatement
                                                        kontrollId={Number(
                                                            kontrollId
                                                        )}
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
                                                            ReportModules.instrumentModule
                                                        }
                                                        label="Instrumenter benyttet til kontrollen"
                                                    />
                                                    <SelectInstruments
                                                        kontrollId={Number(
                                                            kontrollId
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </Block>

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
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                            <ReportSwitch
                                                id={
                                                    ReportModules.attachmentModule
                                                }
                                                label="Vedlegg (Legges til ved nedlastning)"
                                            />
                                            <SelectAttachments
                                                kontrollId={Number(kontrollId)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
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
