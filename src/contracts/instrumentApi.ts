export interface Instrument {
    calibrationInterval: number;
    disponent: UserRef | null;
    gruppe: string;
    id: number;
    name: number;
    needCalibrating: boolean;
    passedCalibrationDate: boolean;
    serienr: string;
    sisteKalibrert: Kalibrering | null;
    toCalibrate: boolean;
    user: UserRef | null;
}

export interface UserRef {
    id: number;
    name: string;
}

export interface Kalibrering {
    date: string;
    id: number;
    kalibreringSertifikat: KalibreringSertifikat;
}

export interface KalibreringSertifikat {
    id: number;
}
