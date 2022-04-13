import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useCurrentUserInstrumentStatus } from '../api/hooks/useInstrument';

export const InstrumentStatus = () => {
    const instrumentStatusData = useCurrentUserInstrumentStatus();

    return (
        <>
            {instrumentStatusData.data?.dispInstruments &&
                instrumentStatusData.data?.dispInstruments.length > 0 && (
                    <Alert severity="info">
                        <AlertTitle>Dine instrumenter</AlertTitle>
                        Disse instrumentene skal kalibreres
                        <ul>
                            {instrumentStatusData.data.dispInstruments.map(
                                (i) => (
                                    <li key={i.id}>{i.name}</li>
                                )
                            )}
                        </ul>
                    </Alert>
                )}
            {instrumentStatusData.data?.ownedInstruments &&
                instrumentStatusData.data.ownedInstruments.length > 0 && (
                    <Alert severity="info">
                        <AlertTitle>
                            Instrumenter du er ansvarlig for
                        </AlertTitle>
                        Disse instrumentene skal kalibreres
                        <ul>
                            {instrumentStatusData.data.ownedInstruments.map(
                                (i) => (
                                    <li key={i.id}>{i.name}</li>
                                )
                            )}
                        </ul>
                    </Alert>
                )}
        </>
    );
};
