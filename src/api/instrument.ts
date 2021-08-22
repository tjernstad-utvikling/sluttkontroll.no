import { Instrument } from '../contracts/instrument';
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
