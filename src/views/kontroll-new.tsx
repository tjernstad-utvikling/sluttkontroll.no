import { makeStyles, withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import { Card } from '../components/card';
import Check from '@material-ui/icons/Check';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import clsx from 'clsx';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useKontroll } from '../data/kontroll';
import { usePageStyles } from '../styles/kontroll/page';

const KontrollNewView = () => {
    const classes = usePageStyles();

    const [activeStep, setActiveStep] = React.useState(0);

    const {
        state: { klienter },
        loadKontroller
    } = useKontroll();

    useEffectOnce(() => {
        loadKontroller();
    });

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card title="Ny kontroll">
                            {klienter !== undefined ? (
                                <div>
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
                                            </StepLabel>
                                        </Step>
                                        <Step>
                                            <StepLabel
                                                StepIconComponent={
                                                    ColorlibStepIcon
                                                }>
                                                Lokasjon
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
                                </div>
                            ) : (
                                <div>Laster klienter</div>
                            )}
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
