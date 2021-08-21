import { Avvik } from '../contracts/avvikApi';
import { AvvikPage } from './modules/avvikPage';
import { Document } from '@react-pdf/renderer';
import { FrontPageData } from './documentContainer';
import { Skjema } from '../contracts/kontrollApi';
import { useEffect } from 'react';
import { useState } from 'react';

interface AvvikReportProps {
    frontPageData?: FrontPageData;
    avvik: Avvik[] | undefined;
    skjemaer: Skjema[] | undefined;
}
interface AvvikModule {
    skjema: Skjema;
    avvik: Avvik[];
}
export const AvvikReport = ({
    frontPageData,
    avvik,
    skjemaer
}: AvvikReportProps) => {
    const [avvikModules, setAvvikModules] = useState<AvvikModule[]>([]);

    useEffect(() => {
        if (avvik !== undefined && skjemaer !== undefined) {
            console.log({ avvik, skjemaer });
            skjemaer.forEach((skjema) => {
                const filteredAvvik = avvik.filter(
                    (a) => a.checklist.skjema.id === skjema.id
                );
                if (filteredAvvik.length > 0) {
                    setAvvikModules((prev) => [
                        ...prev,
                        { skjema, avvik: filteredAvvik }
                    ]);
                }
            });
        }
    }, [avvik, skjemaer]);
    return (
        <Document>
            {avvikModules.length > 0 &&
                frontPageData !== undefined &&
                avvikModules.map((am, i) => (
                    <AvvikPage
                        key={i}
                        frontPageData={frontPageData}
                        skjema={am.skjema}
                        avvik={am.avvik}
                    />
                ))}
        </Document>
    );
};
