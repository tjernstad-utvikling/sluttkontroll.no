import {
    Measurement,
    MeasurementType,
    NewFormMeasurement
} from '../contracts/measurementApi';

import sluttkontrollApi from './sluttkontroll';

export const getMeasurementByKontrollList = async (
    ids: Array<number>
): Promise<{
    status: number;
    measurements: Array<Measurement>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/measurement/kontroll-list/${ids.join()}`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        throw new Error(error);
    }
};
export const getMeasurementTypes = async (): Promise<{
    status: number;
    measurementTypes: Array<MeasurementType>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/measurement/types`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        throw new Error(error);
    }
};
export const newMeasurement = async (
    measurement: NewFormMeasurement,
    skjemaID: number
): Promise<{
    status: number;
    measurement: Measurement;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.post(
            `/measurement/${skjemaID}`,
            { measurement }
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error: any) {
        throw new Error(error);
    }
};
export const updateMeasurementApi = async (
    measurement: Measurement
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.put(`/measurement/`, {
            measurement
        });
        if (status === 204) {
            return { status, ...data };
        }
        throw new Error('not 204');
    } catch (error: any) {
        throw new Error(error);
    }
};
export const deleteMeasurement = async (
    measurementId: number
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status } = await sluttkontrollApi.delete(
            `/measurement/${measurementId}`
        );
        if (status === 204) {
            return { status, message: '' };
        }
        throw new Error('not 204');
    } catch (error: any) {
        throw new Error(error);
    }
};
