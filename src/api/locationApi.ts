import { errorHandler } from '../tools/errorHandler';
import sluttkontrollApi from './sluttkontroll';

// export const uploadImageFile = async (
//     locationId: number,
//     locationImage: LocationImage
// ): Promise<{
//     status: number;
//     locationImage?: LocationImageResponse;
//     message?: string;
// }> => {
//     try {
//         const formData = new FormData();
//         formData.append('image', {
//             uri: locationImage.uri,
//             name: `image_${locationImage.id}.jpeg`,
//             type: 'image/jpeg'
//         });

//         const { status, data } =
//             await sluttkontrollApi.post<UploadImageFileRes>(
//                 `/location/add-image/${locationId}`,
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data'
//                     }
//                 }
//             );

//         return { status, ...data };
//     } catch (error: any) {
//         if (error.response.status === 400) {
//             return { status: 400, message: error.response.data.message };
//         }
//         errorHandler(error);
//         return { status: error.response.status };
//     }
// };

export const getImageFile = async (
    name: string
): Promise<{ status: number; data: Blob }> => {
    try {
        const { status, data } = await sluttkontrollApi.get(
            `/location/image/${name}`,
            {
                responseType: 'blob'
            }
        );

        return { status, data: data };
    } catch (error: any) {
        errorHandler(error);
        throw new Error(error);
    }
};
