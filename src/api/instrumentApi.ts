import { Instrument, Kalibrering } from "../contracts/instrumentApi";

import { User } from "../contracts/userApi";
import { errorHandler } from "../tools/errorHandler";
import sluttkontrollApi from "./sluttkontroll";

interface InstrumentResponse {
  status: number;
  instruments: Instrument[];
}

export const getInstruments = async (): Promise<InstrumentResponse> => {
  try {
    const { status, data } = await sluttkontrollApi.get("/instrument/");
    return { status, ...data };
  } catch (error: any) {
    throw new Error("Error Instrument API Get instruments");
  }
};
interface InstrumentStatusResponse {
  status: number;
  dispInstruments?: Instrument[];
  ownedInstruments?: Instrument[];
}
export const getInstrumentStatusCurrentUser =
  async (): Promise<InstrumentStatusResponse> => {
    try {
      const { status, data } = await sluttkontrollApi.get(
        "/instrument/calibration/status"
      );
      return { status, ...data };
    } catch (error: any) {
      return { status: error.response.status };
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
    const user = instrument.user ? { id: instrument.user.id } : null;
    const { status, data } = await sluttkontrollApi.post("/instrument/", {
      ...instrument,
      user,
    });
    return { status, ...data };
  } catch (error: any) {
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

export const setDisponent = async (
  instrumentId: number,
  userId: number
): Promise<{ status: number }> => {
  try {
    const { status } = await sluttkontrollApi.put(
      `/instrument/disponent/${instrumentId}/${userId}`
    );
    return { status };
  } catch (error: any) {
    throw new Error("Error Instrument API set Disponent");
  }
};

export const removeDisponent = async (
  instrumentId: number
): Promise<{ status: number }> => {
  try {
    const { status } = await sluttkontrollApi.put(
      `/instrument/remove-disponent/${instrumentId}`
    );
    return { status };
  } catch (error: any) {
    throw new Error("Error Instrument API set Disponent");
  }
};

export const addCalibrationFile = async (
  kalibreringId: number,
  sertifikatFile: File
): Promise<{ status: number; message?: string }> => {
  try {
    const formData = new FormData();

    formData.append("sertifikatFile", sertifikatFile);

    const { status, data } = await sluttkontrollApi.post(
      `/instrument/kalibrering/upload-sertifikat/${kalibreringId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { status, ...data };
  } catch (error: any) {
    if (error.response.status === 400) {
      return { status: 400, message: error.response.data.message };
    }
    errorHandler(error);
    throw new Error(error);
  }
};

export const addCalibration = async (
  instrumentId: number,
  kalibrertDate: string
): Promise<{ status: number; instrument?: Instrument; message?: string }> => {
  try {
    const { status, data } = await sluttkontrollApi.post(
      `/instrument/kalibrering/${instrumentId}`,
      { kalibrertDate }
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
  calibration: Kalibrering
): Promise<{
  status: number;
  data?: Blob;
  message?: string;
}> => {
  try {
    const { status, data } = await sluttkontrollApi.get(
      `/instrument/kalibrering-sertifikat/${calibration.kalibreringSertifikat.fileName}`,
      {
        responseType: "blob",
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
