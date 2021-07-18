import { Measurement, MeasurementType } from '../contracts/measurementApi';

import sluttkontrollApi from './sluttkontroll';

export const getMeasurementByKontrollList = async (
    ids: Array<number>
): Promise<{
    status: number;
    measurements: Array<Measurement>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/v3/measurement/kontroll-list/${ids.join()}`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};
export const getMeasurementTypes = async (): Promise<{
    status: number;
    measurementTypes: Array<MeasurementType>;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/v3/measurement/types`
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};
