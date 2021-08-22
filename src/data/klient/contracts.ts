import { Klient, Location } from '../../contracts/kontrollApi';

export interface kontrollState {
    klienter: Array<Klient> | undefined;
}

export enum ActionType {
    setKlienter,
    newKlient,
    updateKlient,
    newLocation,
    updateLocation
}

export interface setKlienter {
    type: ActionType.setKlienter;
    payload: Array<Klient>;
}

export interface newKlient {
    type: ActionType.newKlient;
    payload: Klient;
}
export interface updateKlient {
    type: ActionType.updateKlient;
    payload: Klient;
}
export interface newLocation {
    type: ActionType.newLocation;
    payload: { location: Location; klient: Klient };
}
export interface updateLocation {
    type: ActionType.updateLocation;
    payload: { location: Location; klientId: number };
}

export type KontrollActions =
    | setKlienter
    | newKlient
    | updateKlient
    | newLocation
    | updateLocation;

export interface ContextInterface {
    state: kontrollState;
    loadKlienter: () => Promise<void>;
    saveNewKlient: (
        name: string
    ) => Promise<{ status: boolean; klient?: Klient }>;
    saveEditKlient: (name: string, klient: Klient) => Promise<boolean>;
    saveNewLocation: (
        name: string,
        klient: Klient
    ) => Promise<{ status: boolean; location?: Location }>;
    saveEditLocation: (
        name: string,
        klientId: number,
        location: Location
    ) => Promise<boolean>;
}