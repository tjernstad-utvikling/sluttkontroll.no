import { ExtendedSkjema, ReportKontroll } from '../contracts/kontrollApi';
import {
    LocalImage,
    ReportModules,
    ReportSetting
} from '../contracts/reportApi';
import { Measurement, MeasurementType } from '../contracts/measurementApi';
import { createContext, useContext, useState } from 'react';
import { handleReportSettings, loadReportStatement } from './utils/loaders';
import {
    useMeasurementTypes,
    useMeasurements
} from '../api/hooks/useMeasurement';

import { Attachment } from '../contracts/attachmentApi';
import { Avvik } from '../contracts/avvikApi';
import { OutputData } from '@editorjs/editorjs';
import { crop } from '../tools/crop';
import { errorHandler } from '../tools/errorHandler';
import { getImageFile } from '../api/imageApi';
import { getInfoText } from '../api/settingsApi';
import { getImageFile as getLocationImageFile } from '../api/locationApi';
import { updateReportSetting } from '../api/reportApi';
import { useAttachments } from '../api/hooks/useAttachments';
import { useAvvik } from '../api/hooks/useAvvik';
import { useDebounce } from '../hooks/useDebounce';
import { useEffect } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useReportKontrollById } from '../api/hooks/useKontroll';
import { useSkjemaerReport } from '../api/hooks/useSkjema';
import { useSnackbar } from 'notistack';

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useReport = () => {
    return useContext(Context);
};

export const DocumentContainer = ({
    children,
    kontrollId
}: {
    children: React.ReactNode;
    kontrollId: number;
}): JSX.Element => {
    const { enqueueSnackbar } = useSnackbar();

    const [locationImageUrl, setLocationImageUrl] = useState<string>();
    const [reportSetting, setReportSetting] = useState<ReportSetting>();

    const skjemaData = useSkjemaerReport({ kontrollId });
    const kontrollData = useReportKontrollById(kontrollId);

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

    const attachmentsData = useAttachments({ kontrollId });
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
            if (kontrollData.data) {
                if (kontrollData.data?.location.locationImage) {
                    try {
                        const res = await getLocationImageFile(
                            kontrollData.data?.location.locationImage.url
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
    }, [kontrollData.data]);

    const [previewDocument, setPreviewDocument] = useState<boolean>(false);
    const [downloadReport, setDownloadReport] = useState<boolean>(false);

    const [filteredSkjemaer, setFilteredSkjemaer] =
        useState<ExtendedSkjema[]>();

    const avvikData = useAvvik({
        includeClosed: true,
        kontrollId: kontrollId
    });

    const measurementData = useMeasurements({ kontrollId });

    const mTypeData = useMeasurementTypes();

    useEffectOnce(async () => {
        await handleReportSettings({
            kontrollId,
            setReportSetting
        });

        const { infoText } = await getInfoText();
        setInfoText(infoText);

        setStatementText(
            await loadReportStatement(kontrollId, enqueueSnackbar)
        );

        setHasLoaded(true);
    });

    useEffect(() => {
        if (
            attachmentsData.data &&
            hasLoaded &&
            reportSetting?.selectedAttachments
        ) {
            if (reportSetting?.selectedAttachments.length > 0) {
                setSelectedAttachments(
                    attachmentsData.data.filter((s) =>
                        reportSetting?.selectedAttachments.includes(s.id)
                    )
                );
            }
        }
    }, [attachmentsData.data, hasLoaded, reportSetting]);

    useEffect(() => {
        if (skjemaData.data !== undefined && hasLoaded) {
            if (reportSetting?.selectedSkjemaer.length === 0) {
                setFilteredSkjemaer(skjemaData.data);
            } else {
                if (skjemaData.data)
                    setFilteredSkjemaer(
                        skjemaData.data?.filter((s) =>
                            reportSetting?.selectedSkjemaer.includes(s.id)
                        )
                    );
            }
        }
    }, [kontrollId, reportSetting, hasLoaded, skjemaData.data]);

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

    const updateKontroll = () => {
        setPreviewDocument(false);
        setDownloadReport(false);
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

                kontroll: kontrollData.data,
                locationImageUrl,
                updateKontroll,

                skjemaer: skjemaData.data,
                filteredSkjemaer,
                updateFilteredSkjemaer,

                avvik: avvikData.data,

                measurements: measurementData.data,
                measurementTypes: mTypeData.data,

                attachments: attachmentsData.data,
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
    updateKontroll: () => void;
    skjemaer: ExtendedSkjema[] | undefined;
    filteredSkjemaer: ExtendedSkjema[] | undefined;
    updateFilteredSkjemaer: (skjemaer: ExtendedSkjema[] | undefined) => void;

    avvik: Avvik[] | undefined;

    measurements: Measurement[] | undefined;
    measurementTypes: MeasurementType[] | undefined;

    attachments: Attachment[] | undefined;

    selectedAttachments: Attachment[];
    updateSelectedAttachments: (attachments: Attachment[]) => void;
}
