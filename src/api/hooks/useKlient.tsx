import { Klient, Location, LocationImage } from '../../contracts/kontrollApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import sluttkontrollApi from '../sluttkontroll';
import unionBy from 'lodash.unionby';
import { useSnackbar } from 'notistack';

export function useExternalKlienter() {
    return useQuery('klient', async () => {
        const { data } = await sluttkontrollApi.get<{
            klienter: Klient[];
        }>(`/klient/access-by-external`);
        return data.klienter;
    });
}

export function useClients() {
    return useQuery(['klient'], async () => {
        const { data } = await sluttkontrollApi.get<{
            klienter: Klient[];
        }>(`/klient`);
        return data.klienter;
    });
}

export function useClientById({ clientId }: { clientId: number }) {
    const queryClient = useQueryClient();
    return useQuery(
        ['klient', clientId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                klient: Klient;
            }>(`/klient/${clientId}`);
            return data.klient;
        },
        {
            initialData: () => {
                return queryClient
                    .getQueryData<Klient[]>(['klient'])
                    ?.find((k) => k.id === clientId);
            },
            // The query will not execute until the userId exists
            enabled: !!clientId
        }
    );
}

export function useAddNewClient() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Klient,
        unknown,
        {
            name: string;
            setClient: (client: Klient) => void;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                klient: Klient;
            }>('/klient/', {
                name: body.name
            });
            return data.klient;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (nweClient, vars) => {
                const klienter = queryClient.getQueryData<Klient[]>(['klient']);
                // ✅ update detail view directly

                vars.setClient(nweClient);
                if (klienter && klienter?.length > 0) {
                    queryClient.setQueryData(
                        ['klient'],
                        unionBy([nweClient], klienter, 'id').sort(
                            (a, b) => a.id - b.id
                        )
                    );
                }
                queryClient.invalidateQueries(['klient']);

                enqueueSnackbar('Ny kunde er lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Navn mangler', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar(
                        'Problemer med lagring av kontrollegenskaper',
                        {
                            variant: 'error'
                        }
                    );
                }
            }
        }
    );
}

export function useUpdateClient() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            name: string;
            clientId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/klient/${body.clientId}`,
                {
                    name: body.name
                }
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const klienter = queryClient.getQueryData<Klient[]>(['klient']);
                // ✅ update detail view directly

                const client = klienter?.find((k) => k.id === vars.clientId);

                if (client) {
                    queryClient.setQueryData(
                        ['klient'],
                        unionBy(
                            [{ ...client, name: vars.name }],
                            klienter,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );

                    queryClient.setQueryData(['klient', vars.clientId], {
                        ...client,
                        name: vars.name
                    });
                }
                queryClient.invalidateQueries(['klient']);

                enqueueSnackbar('Kunde er oppdatert', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Navn mangler', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar('Problemer med lagring av kunde', {
                        variant: 'error'
                    });
                }
            }
        }
    );
}

export function useLocationById({
    locationId,
    clientId
}: {
    locationId: number;
    clientId: number;
}) {
    const queryClient = useQueryClient();
    return useQuery(
        ['location', locationId],
        async () => {
            const { data } = await sluttkontrollApi.get<{
                location: Location & { klient: { id: number } };
            }>(`/location/${locationId}`);
            return data.location;
        },
        {
            initialData: () => {
                const client = queryClient
                    .getQueryData<Klient[]>(['klient'])
                    ?.find((k) => k.id === clientId);

                const location = client?.locations.find(
                    (l) => l.id === locationId
                );
                if (location) return { ...location, klient: { id: clientId } };
            },
            // The query will not execute until the userId exists
            enabled: !!locationId
        }
    );
}

export function useAddNewLocation() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        Location,
        unknown,
        {
            name: string;
            clientId: number;
            setLocation: (location: Location) => void;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.post<{
                location: Location;
            }>(`/location/${body.clientId}`, {
                name: body.name
            });
            return data.location;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (newLocation, vars) => {
                const klienter = queryClient.getQueryData<Klient[]>(['klient']);
                // ✅ update detail view directly

                const client = klienter?.find((k) => k.id === vars.clientId);

                vars.setLocation(newLocation);
                if (client) {
                    queryClient.setQueryData(
                        ['klient'],
                        unionBy(
                            [
                                {
                                    ...client,
                                    locations: unionBy(
                                        [newLocation],
                                        client.locations
                                    ).sort((a, b) => a.id - b.id)
                                }
                            ],
                            klienter,
                            'id'
                        ).sort((a, b) => a.id - b.id)
                    );
                }
                queryClient.invalidateQueries(['klient']);

                enqueueSnackbar('Ny lokasjon er lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Navn mangler', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar('Problemer med lagring av lokasjon', {
                        variant: 'error'
                    });
                }
            }
        }
    );
}

export function useUpdateLocation() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            name: string;
            clientId: number;
            locationId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.put(
                `/location/${body.locationId}`,
                {
                    name: body.name
                }
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const location = queryClient.getQueryData<
                    Location & { klient: { id: number } }
                >(['location', vars.locationId]);
                // ✅ update detail view directly

                if (location) {
                    queryClient.setQueryData(['location', vars.locationId], {
                        ...location,
                        name: vars.name
                    });
                }
                queryClient.invalidateQueries(['klient']);

                enqueueSnackbar('Lokasjon lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Navn mangler', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar('Problemer med lagring av lokasjon', {
                        variant: 'error'
                    });
                }
            }
        }
    );
}

export function useAddLocationImage() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        LocationImage,
        unknown,
        {
            locationId: number;
            image: File;
        }
    >(
        async (body) => {
            const formData = new FormData();

            formData.append('image', body.image);

            const { data } = await sluttkontrollApi.post<{
                locationImage: LocationImage;
            }>(`/location/add-image/${body.locationId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data.locationImage;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (locationImage, vars) => {
                const location = queryClient.getQueryData<
                    Location & { klient: { id: number } }
                >(['location', vars.locationId]);
                // ✅ update detail view directly

                if (location) {
                    queryClient.setQueryData(['location', vars.locationId], {
                        ...location,
                        locationImage: locationImage
                    });
                }
                queryClient.invalidateQueries(['klient']);

                enqueueSnackbar('Lokasjonsbilde er lagret', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Bilde ble ikke lagret', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar('Problemer med lagring av lokasjon', {
                        variant: 'error'
                    });
                }
            }
        }
    );
}

export function useDeleteLocationImage() {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation<
        any,
        unknown,
        {
            locationId: number;
            imageId: number;
        }
    >(
        async (body) => {
            const { data } = await sluttkontrollApi.delete(
                `/location/image/${body.imageId}`
            );
            return data;
        },
        {
            // 💡 response of the mutation is passed to onSuccess
            onSuccess: (_, vars) => {
                const location = queryClient.getQueryData<
                    Location & { klient: { id: number } }
                >(['location', vars.locationId]);
                // ✅ update detail view directly

                if (location) {
                    queryClient.setQueryData(['location', vars.locationId], {
                        ...location,
                        locationImage: null
                    });
                }
                queryClient.invalidateQueries(['klient']);

                enqueueSnackbar('Lokasjonsbilde er slettet', {
                    variant: 'success'
                });
            },
            onError: (error: any) => {
                if (error.response.status === 400) {
                    enqueueSnackbar('Bilde ble ikke slettet', {
                        variant: 'warning'
                    });
                } else {
                    enqueueSnackbar('Problemer med sletting av bilde', {
                        variant: 'error'
                    });
                }
            }
        }
    );
}
