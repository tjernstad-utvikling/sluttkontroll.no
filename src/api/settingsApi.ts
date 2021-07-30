import sluttkontrollApi from './sluttkontroll';

export const getInfoText = async (): Promise<{
    status: number;
    infoText: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            '/v3/settings/get-info-text'
        );
        if (status === 200) {
            return { status, ...data };
        }
        throw new Error('not 200');
    } catch (error) {
        throw new Error(error);
    }
};
