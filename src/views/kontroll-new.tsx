import { Klient, Location } from '../contracts/kontrollApi';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import AddLocationIcon from '@material-ui/icons/AddLocation';
import { Card } from '../components/card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { KlientSchema } from '../schema/klient';
import { KontrollSchema } from '../schema/kontroll';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import { LocationSchema } from '../schema/location';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import React from 'react';
import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { User } from '../contracts/userApi';
import clsx from 'clsx';
import { useClient } from '../data/klient';
import { useHistory } from 'react-router-dom';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';
import { useState } from 'react';

const KontrollNewView = () => {
    const classes = usePageStyles();

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
                                ? selectedKlient.objekts
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
                'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%);'
        }
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%)'
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
            'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%);',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    },
    completed: {
        backgroundImage:
            'linear-gradient(97deg, rgba(26,77,39,1) 39%, rgba(51,153,77,1) 100%);'
    }
});

function ColorlibStepIcon(props: StepIconProps) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <LocationCityIcon />,
        2: <AddLocationIcon />,
        3: <PlaylistAddCheckIcon />
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
