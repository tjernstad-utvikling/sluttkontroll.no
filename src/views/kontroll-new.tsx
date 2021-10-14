import { Card, CardContent } from '../components/card';
import { Klient, Location } from '../contracts/kontrollApi';
import React, { useState } from 'react';
import StepConnector, {
    stepConnectorClasses
} from '@mui/material/StepConnector';

import AddLocationIcon from '@mui/icons-material/AddLocation';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { KlientSchema } from '../schema/klient';
import { KontrollSchema } from '../schema/kontroll';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { LocationSchema } from '../schema/location';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import Step from '@mui/material/Step';
import { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { User } from '../contracts/userApi';
import { styled } from '@mui/material/styles';
import { useClient } from '../data/klient';
import { useHistory } from 'react-router-dom';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';

const KontrollNewView = () => {
    const { classes } = usePageStyles();

    const history = useHistory();

    const { saveNewKontroll } = useKontroll();
    const { saveNewKlient, saveNewLocation } = useClient();
    const [activeStep, setActiveStep] = useState(0);
    const [selectedKlient, setSelectedKlient] = useState<Klient>();
    const [selectedLocation, setSelectedLocation] = useState<Location>();

    const createNew = async (name: string) => {
        const res = await saveNewKlient(name);
        if (res.status && res.klient !== undefined) {
            setSelectedKlient(res.klient);
            setActiveStep(1);
        }
        return res.status;
    };
    const createNewLocation = async (name: string) => {
        if (selectedKlient !== undefined) {
            const res = await saveNewLocation(name, selectedKlient);
            if (res.status && res.location !== undefined) {
                setSelectedLocation(res.location);
                setActiveStep(2);
            }
            return res.status;
        }
        return false;
    };
    const saveKontroll = async (
        name: string,
        user: User,
        avvikUtbedrere: Array<User> | null
    ): Promise<boolean> => {
        if (selectedLocation !== undefined) {
            if (
                await saveNewKontroll(
                    name,
                    avvikUtbedrere !== null ? avvikUtbedrere : [],
                    selectedLocation,
                    user
                )
            ) {
                history.push('/kontroll');
                return true;
            }
            return false;
        }
        return false;
    };

    const onSelectKlient = (klient: Klient) => {
        setSelectedKlient(klient);
        setActiveStep(1);
    };
    const onSelectLocation = (location: Location) => {
        setSelectedLocation(location);
        setActiveStep(2);
    };

    const formSwitch = () => {
        switch (activeStep) {
            case 0:
                return (
                    <KlientSchema
                        onCreateNew={createNew}
                        onSubmit={onSelectKlient}
                    />
                );
            case 1:
                return (
                    <LocationSchema
                        locations={
                            selectedKlient !== undefined
                                ? selectedKlient.locations
                                : []
                        }
                        onCreateNew={createNewLocation}
                        onSubmit={onSelectLocation}
                    />
                );
            case 2:
                return <KontrollSchema onSubmit={saveKontroll} />;
        }
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny kontroll">
                            <CardContent>
                                <Stepper
                                    alternativeLabel
                                    activeStep={activeStep}
                                    connector={<ColorlibConnector />}>
                                    <Step>
                                        <StepLabel
                                            StepIconComponent={
                                                ColorlibStepIcon
                                            }>
                                            Klient
                                            <br /> {selectedKlient?.name}
                                        </StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel
                                            StepIconComponent={
                                                ColorlibStepIcon
                                            }>
                                            Lokasjon
                                            <br /> {selectedLocation?.name}
                                        </StepLabel>
                                    </Step>
                                    <Step>
                                        <StepLabel
                                            StepIconComponent={
                                                ColorlibStepIcon
                                            }>
                                            Kontroll
                                        </StepLabel>
                                    </Step>
                                </Stepper>
                                {formSwitch()}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default KontrollNewView;

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%);'
        }
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%);'
        }
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1
    }
}));

const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
    backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
            'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%);',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%);'
    })
}));

function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <LocationCityIcon />,
        2: <AddLocationIcon />,
        3: <PlaylistAddCheckIcon />
    };

    return (
        <ColorlibStepIconRoot
            ownerState={{ completed, active }}
            className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}
