import React, { useState } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { TopBar } from './topBar';
import clsx from 'clsx';
import { useMainStyles } from '../../styles/layout/main';

interface ExternalLayoutProps {
    children: React.ReactNode;
    module: 'kontroll' | 'instrument';
}
export const ExternalLayout = ({
    children,
    module
}: ExternalLayoutProps): JSX.Element => {
    const { classes } = useMainStyles();
    const [open, setOpen] = useState<boolean>(true);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <TopBar
                isOpenLeftDrawerOpen={open}
                toggleLeftDrawer={() => setOpen(!open)}
                toggleRightDrawer={() => setIsMenuOpen(!isMenuOpen)}
                module={module}
            />
        
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open
                })}>
                {children}
            </main>
        </div>
    );
};
