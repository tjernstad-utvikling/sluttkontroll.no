import { Klient, Location } from '../contracts/kontrollApi';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { KlientSchema } from '../schema/klient';
import { LocationSchema } from '../schema/location';
import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import clsx from 'clsx';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const KontrollNewView = () => {
    const classes = usePageStyles();

    const { saveNewKlient, saveNewLocation } = useKontroll();
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
                                ? selectedKlient.objekts
                                : []
                        }
                        onCreateNew={createNewLocation}
                        onSubmit={onSelectLocation}
                    />
                );
        }
    };

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny kontroll">
                            <Stepper
                                alternativeLabel
                                activeStep={activeStep}
                                connector={<ColorlibConnector />}>
                                <Step>
                                    <StepLabel
                                        StepIconComponent={ColorlibStepIcon}>
                                        Klient
                                        <br /> {selectedKlient?.name}
                                    </StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel
                                        StepIconComponent={ColorlibStepIcon}>
                                        Lokasjon
                                        <br /> {selectedLocation?.name}
                                    </StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel
                                        StepIconComponent={ColorlibStepIcon}>
                                        Kontroll
                                    </StepLabel>
                                </Step>
                            </Stepper>
                            {formSwitch()}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default KontrollNewView;

const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
        }
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
        }
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1
    }
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    active: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    },
    completed: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
    }
});

function ColorlibStepIcon(props: StepIconProps) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <SettingsIcon />,
        2: <GroupAddIcon />,
        3: <VideoLabelIcon />
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed
            })}>
            {icons[String(props.icon)]}
        </div>
    );
}