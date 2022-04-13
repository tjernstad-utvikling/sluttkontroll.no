import { Instrument, Kalibrering } from '../contracts/instrumentApi';

import sluttkontrollApi from './sluttkontroll';

interface InstrumentStatusResponse {
    status: number;
    dispInstruments?: Instrument[];
    ownedInstruments?: Instrument[];
}
export const getInstrumentStatusCurrentUser =
    async (): Promise<InstrumentStatusResponse> => {
        try {
            const { status, data } = await sluttkontrollApi.get(
                '/instrument/calibration/status'
            );
            return { status, ...data };
        } catch (error: any) {
            return { status: error.response.status };
        }
    };

export const editInstrument = async (
    instrument: Instrument
): Promise<{ status: number; message: string }> => {
    try {
        const user = instrument.user ? { id: instrument.user.id } : null;
        const disponent = instrument.disponent
            ? { id: instrument.disponent.id }
            : null;

        const { status, data } = await sluttkontrollApi.put(
            `/instrument/${instrument.id}`,
            { ...instrument, user, disponent }
        );
        return { status, ...data };
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};

export const getCalibrationsByInstrument = async (
    instrumentId: number
): Promise<{
    status: number;
    calibrations?: Kalibrering[];
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/instrument/kalibrering/${instrumentId}`
        );
        return { status, ...data };
    } catch (error: any) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};

export const getCalibrationCertificate = async (
    calibrationId: number
): Promise<{
    status: number;
    data?: Blob;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/instrument/kalibrering-sertifikat/${calibrationId}`,
            {
                responseType: 'blob'
            }
        );
        return { status, data };
    } catch (error: any) {
        if (error.response.status === 404) {
            return { status: 404, message: error.response.data.message };
        }
        throw new Error(error);
    }
};
