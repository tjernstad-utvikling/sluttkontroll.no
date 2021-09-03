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
    } catch (error: any) {
        console.error(error);
        throw new Error('');
    }
};
export const setInfoText = async (
    infoText: string
): Promise<{
    status: number;
    message: string;
}> => {
    try {
        const { status, data } = await sluttkontrollApi.put(
            '/v3/settings/set-info-text',
            {
                infoText
            }
        );

        return { status, ...data };
    } catch (error: any) {
        console.error(error);
        throw new Error('');
    }
};
