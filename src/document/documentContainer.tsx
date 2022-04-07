import {
    Checklist,
    ExtendedSkjema,
    ReportKontroll
} from '../contracts/kontrollApi';
import {
    LocalImage,
    ReportModules,
    ReportSetting
} from '../contracts/reportApi';
import { Measurement, MeasurementType } from '../contracts/measurementApi';
import { createContext, useContext, useState } from 'react';
import {
    handleReportSettings,
    loadAttachments,
    loadReportStatement
} from './utils/loaders';

import { Attachment } from '../contracts/attachmentApi';
import { Avvik } from '../contracts/avvikApi';
import { OutputData } from '@editorjs/editorjs';
import { crop } from '../tools/crop';
import { errorHandler } from '../tools/errorHandler';
import { getImageFile } from '../api/imageApi';
import { getInfoText } from '../api/settingsApi';
import { getKontrollReportData } from '../api/kontrollApi';
import { getImageFile as getLocationImageFile } from '../api/locationApi';
import { updateReportSetting } from '../api/reportApi';
import { useAvvik } from '../data/avvik';
import { useDebounce } from '../hooks/useDebounce';
import { useEffect } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { useMeasurement } from '../data/measurement';
import { useSnackbar } from 'notistack';
import { useUser } from '../data/user';

const Context = createContext<ContextInterface>({} as ContextInterface);
const checklists: Checklist[] = [];

export const useReport = () => {
    return useContext(Context);
};

export const DocumentContainer = ({
    children,
    kontrollId,
    objectId
}: {
    children: React.ReactNode;
    kontrollId: number;
    objectId: number;
}): JSX.Element => {
    const { enqueueSnackbar } = useSnackbar();

    const [kontroll, setKontroll] = useState<ReportKontroll>();
    const [locationImageUrl, setLocationImageUrl] = useState<string>();
    const [reportSetting, setReportSetting] = useState<ReportSetting>();

    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    const debouncedSetting = useDebounce<ReportSetting | undefined>(
        reportSetting,
        3000
    );
    // Effect for API call
    useEffect(
        () => {
            const save = async () => {
                if (debouncedSetting) {
                    updateReportSetting(debouncedSetting, kontrollId);
                }
            };
            save();
        },
        [debouncedSetting, kontrollId] // Only call effect if debounced search term changes
    );

    const [_infoText, setInfoText] = useState<OutputData>();
    const [_statementText, setStatementText] = useState<OutputData>();
    const [_statementImages, setStatementImages] = useState<LocalImage[]>([]);

    const [attachments, setAttachments] = useState<Attachment[] | undefined>();
    const [selectedAttachments, setSelectedAttachments] = useState<
        Attachment[]
    >([]);

    useEffect(() => {
        const load = async () => {
            if (_statementText) {
                for (const block of _statementText.blocks) {
                    if (block.type === 'image') {
                        try {
                            const res = await getImageFile(block.data.file.url);

                            if (res.status === 200) {
                                const url = URL.createObjectURL(res.data);

                                setStatementImages((prev) => {
                                    return [
                                        ...prev,
                                        { name: block.data.file.url, uri: url }
                                    ];
                                });
                            }
                        } catch (error: any) {
                            enqueueSnackbar('Problemer med lasting av bilder');
                            errorHandler(error);
                        }
                    }
                }
            }
        };
        load();
        return () => {
            _statementImages.forEach((i) => URL.revokeObjectURL(i.uri));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_statementText]);

    useEffect(() => {
        const load = async () => {
            if (kontroll) {
                if (kontroll?.location.locationImage) {
                    try {
                        const res = await getLocationImageFile(
                            kontroll?.location.locationImage.url
                        );

                        if (res.status === 200) {
                            const url = URL.createObjectURL(res.data);
                            const newImageUrl = await crop(url, 16 / 9);

                            setLocationImageUrl(newImageUrl);
                            URL.revokeObjectURL(url);
                        }
                    } catch (error: any) {
                        enqueueSnackbar('Problemer med lasting av bildet');
                        errorHandler(error);
                    }
                }
            }
        };
        load();
        return () => {
            URL.revokeObjectURL(locationImageUrl || '');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kontroll]);

    const [previewDocument, setPreviewDocument] = useState<boolean>(false);
    const [downloadReport, setDownloadReport] = useState<boolean>(false);

    const {
        state: { skjemaer }
    } = useKontroll();

    const [_skjemaer, setSkjemaer] = useState<ExtendedSkjema[]>();
    const [filteredSkjemaer, setFilteredSkjemaer] =
        useState<ExtendedSkjema[]>();

    const {
        state: { avvik }
    } = useAvvik();

    const {
        state: { measurements, measurementTypes }
    } = useMeasurement();

    const { loadUsers } = useUser();

    useEffectOnce(async () => {
        loadUsers();
        const { status, kontroll: _kontroll } = await getKontrollReportData(
            kontrollId
        );
        if (status === 200) {
            setKontroll(_kontroll);
            await handleReportSettings({
                kontroll: _kontroll,
                setReportSetting
            });

            const { infoText } = await getInfoText();
            setInfoText(infoText);

            setStatementText(
                await loadReportStatement(kontrollId, enqueueSnackbar)
            );

            setAttachments(await loadAttachments(kontrollId, enqueueSnackbar));

            setHasLoaded(true);
        }
    });

    useEffect(() => {
        if (attachments && hasLoaded && reportSetting?.selectedAttachments) {
            if (reportSetting?.selectedAttachments.length > 0) {
                setSelectedAttachments(
                    attachments.filter((s) =>
                        reportSetting?.selectedAttachments.includes(s.id)
                    )
                );
            }
        }
    }, [attachments, hasLoaded, reportSetting]);

    useEffect(() => {
        if (skjemaer !== undefined && hasLoaded && checklists) {
            const kontrollSkjemaer = skjemaer
                .filter((s) => s.kontroll.id === kontrollId)
                .map((ks) => {
                    return {
                        ...ks,
                        checklists: checklists?.filter(
                            (ch) => ch.skjema.id === ks.id
                        )
                    };
                });

            setSkjemaer(kontrollSkjemaer);
            if (reportSetting?.selectedSkjemaer.length === 0) {
                setFilteredSkjemaer(kontrollSkjemaer);
            } else {
                setFilteredSkjemaer(
                    kontrollSkjemaer.filter((s) =>
                        reportSetting?.selectedSkjemaer.includes(s.id)
                    )
                );
            }
        }
    }, [skjemaer, kontrollId, reportSetting, hasLoaded]);

    const toggleModuleVisibilityState = (id: ReportModules) => {
        setPreviewDocument(false);
        setDownloadReport(false);
        if (reportSetting) {
            if (reportSetting.modules.includes(id)) {
                setReportSetting((prev) => {
                    if (prev) {
                        return {
                            ...prev,
                            modules: prev.modules.filter((vrm) => vrm !== id)
                        };
                    }
                });
            } else {
                setReportSetting((prev) => {
                    if (prev) {
                        return {
                            ...prev,
                            modules: [...prev.modules, id]
                        };
                    }
                });
            }
        }
    };

    const isModuleActive = (reportModule: ReportModules): boolean => {
        return reportSetting?.modules.includes(reportModule) || false;
    };

    const updateKontroll = (reportKontroll: ReportKontroll) => {
        setPreviewDocument(false);
        setDownloadReport(false);
        setKontroll(reportKontroll);
    };

    const updateStatement = (text: OutputData) => {
        setPreviewDocument(false);
        setDownloadReport(false);
        setStatementText(text);
    };

    const updateSetting = (setting: ReportSetting) => {
        setPreviewDocument(false);
        setDownloadReport(false);
        setReportSetting(setting);
    };
    const updateSelectedAttachments = (attachments: Attachment[]) => {
        setPreviewDocument(false);
        setDownloadReport(false);
        setSelectedAttachments(attachments);

        setReportSetting((prev) => {
            if (prev) {
                return {
                    ...prev,
                    selectedAttachments: attachments?.map((s) => s.id) || []
                };
            }
        });
    };

    const updateFilteredSkjemaer = (skjemaer: ExtendedSkjema[] | undefined) => {
        setPreviewDocument(false);
        setDownloadReport(false);
        setFilteredSkjemaer(skjemaer);

        setReportSetting((prev) => {
            if (prev) {
                return {
                    ...prev,
                    selectedSkjemaer: skjemaer?.map((s) => s.id) || []
                };
            }
        });
    };

    return (
        <Context.Provider
            value={{
                toggleModuleVisibilityState,
                previewDocument,
                hasLoaded,
                setPreviewDocument,
                downloadReport,
                setDownloadReport,
                statementImages: _statementImages,

                isModuleActive,
                infoText: _infoText,
                statementText: _statementText,
                updateStatement,
                reportSetting,
                updateSetting,

                kontroll,
                locationImageUrl,
                updateKontroll,

                skjemaer: _skjemaer,
                filteredSkjemaer,
                updateFilteredSkjemaer,

                avvik: avvik,

                measurements,
                measurementTypes,

                attachments,
                setAttachments,
                selectedAttachments,
                updateSelectedAttachments
            }}>
            {children}
        </Context.Provider>
    );
};

interface ContextInterface {
    toggleModuleVisibilityState: (id: ReportModules) => void;
    previewDocument: boolean;
    hasLoaded: boolean;
    setPreviewDocument: React.Dispatch<React.SetStateAction<boolean>>;
    downloadReport: boolean;
    setDownloadReport: React.Dispatch<React.SetStateAction<boolean>>;
    statementImages: LocalImage[];

    infoText: OutputData | undefined;
    statementText: OutputData | undefined;
    updateStatement: (text: OutputData) => void;
    reportSetting: ReportSetting | undefined;
    updateSetting: (setting: ReportSetting) => void;
    isModuleActive: (reportModule: ReportModules) => boolean;

    kontroll: ReportKontroll | undefined;
    locationImageUrl: string | undefined;
    updateKontroll: (reportKontroll: ReportKontroll) => void;
    skjemaer: ExtendedSkjema[] | undefined;
    filteredSkjemaer: ExtendedSkjema[] | undefined;
    updateFilteredSkjemaer: (skjemaer: ExtendedSkjema[] | undefined) => void;

    avvik: Avvik[] | undefined;

    measurements: Measurement[] | undefined;
    measurementTypes: MeasurementType[] | undefined;

    attachments: Attachment[] | undefined;
    setAttachments: React.Dispatch<
        React.SetStateAction<Attachment[] | undefined>
    >;
    selectedAttachments: Attachment[];
    updateSelectedAttachments: (attachments: Attachment[]) => void;
}
