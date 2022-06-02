import sluttkontrollApi from './sluttkontroll';

export const getCalibrationCertificate = async (
    calibrationFileName: string
): Promise<{
    status: number;
    data?: Blob;
    message?: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/instrument/kalibrering-sertifikat/${calibrationFileName}`,
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
