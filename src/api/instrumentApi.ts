import { Instrument } from '../contracts/instrumentApi';
import { User } from '../contracts/userApi';
import sluttkontrollApi from './sluttkontroll';

interface InstrumentResponse {
    status: number;
    instruments: Instrument[];
}

export const getInstruments = async (): Promise<InstrumentResponse> => {
    try {
        const { status, data } = await sluttkontrollApi.get('/v3/instrument/');
        return { status, ...data };
    } catch (error) {
        throw new Error('Error Instrument API Get instruments');
    }
};

export const newInstrument = async (instrument: {
    name: string;
    serienr: string;
    user: User | null;
    toCalibrate: boolean;
    calibrationInterval: number;
}): Promise<{ status: number; instrument?: Instrument; message?: string }> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            '/v3/instrument/',
            instrument
        );
        return { status, ...data };
    } catch (error) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};
export const addCalibration = async (
    instrumentId: number,
    kalibrertDate: string
): Promise<{ status: number; instrument?: Instrument; message?: string }> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/v3/instrument/kalibrering/${instrumentId}`,
            { kalibrertDate }
        );
        return { status, ...data };
    } catch (error) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};

export const editInstrument = async (
    instrument: Instrument
): Promise<{ status: number; message: string }> => {
    try {
        const { status, data } = await sluttkontrollApi.put(
            `/v3/instrument/${instrument.id}`,
            instrument
        );
        return { status, ...data };
    } catch (error) {
        if (error.response.status === 400) {
            return { status: 400, message: error.response.data.message };
        }
        throw new Error(error);
    }
};

export const setDisponent = async (
    instrumentId: number,
    userId: number
): Promise<{ status: number }> => {
    try {
        const { status } = await sluttkontrollApi.put(
            `/v3/instrument/disponent/${instrumentId}/${userId}`
        );
        return { status };
    } catch (error) {
        throw new Error('Error Instrument API set Disponent');
    }
};

export const removeDisponent = async (
    instrumentId: number
): Promise<{ status: number }> => {
    try {
        const { status } = await sluttkontrollApi.put(
            `/v3/instrument/remove-disponent/${instrumentId}`
        );
        return { status };
    } catch (error) {
        throw new Error('Error Instrument API set Disponent');
    }
};
