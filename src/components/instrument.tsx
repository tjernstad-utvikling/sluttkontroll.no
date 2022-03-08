import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Instrument } from '../contracts/instrumentApi';
import { getInstrumentStatusCurrentUser } from '../api/instrumentApi';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useState } from 'react';
export const InstrumentStatus = () => {
    const [_dispInstruments, setDispInstruments] = useState<Instrument[]>([]);
    const [_ownedInstruments, setOwnedInstruments] = useState<Instrument[]>([]);

    async function checkInstruments() {
        const { status, dispInstruments, ownedInstruments } =
            await getInstrumentStatusCurrentUser();
        if (status === 200) {
            if (dispInstruments) setDispInstruments(dispInstruments);
            if (ownedInstruments) setOwnedInstruments(ownedInstruments);
        }
    }

    useEffectOnce(() => {
        checkInstruments();
    });

    return (
        <>
            {_dispInstruments && _dispInstruments.length > 0 && (
                <Alert severity="info">
                    <AlertTitle>Dine instrumenter</AlertTitle>
                    Disse instrumentene skal kalibreres
                    <ul>
                        {_dispInstruments.map((i) => (
                            <li key={i.id}>{i.name}</li>
                        ))}
                    </ul>
                </Alert>
            )}
            {_ownedInstruments && _ownedInstruments.length > 0 && (
                <Alert severity="info">
                    <AlertTitle>Instrumenter du er ansvarlig for</AlertTitle>
                    Disse instrumentene skal kalibreres
                    <ul>
                        {_ownedInstruments.map((i) => (
                            <li key={i.id}>{i.name}</li>
                        ))}
                    </ul>
                </Alert>
            )}
        </>
    );
};
