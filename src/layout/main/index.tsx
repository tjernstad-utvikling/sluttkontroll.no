import React, { useState } from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { LeftDrawer } from './leftDrawer';
import { RightDrawer } from './rightDrawer';
import { TopBar } from './topBar';
import clsx from 'clsx';
import { useMainStyles } from '../../styles/layout/main';

interface MainLayoutProps {
    children: React.ReactNode;
}
export const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
    const classes = useMainStyles();
    const [open, setOpen] = useState<boolean>(true);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <TopBar
                isOpenLeftDrawerOpen={open}
                toggleLeftDrawer={() => setOpen(!open)}
                toggleRightDrawer={() => setIsMenuOpen(!isMenuOpen)}
            />
            <LeftDrawer isOpen={open} />
            <RightDrawer
                isOpen={isMenuOpen}
                toggle={() => setIsMenuOpen(!isMenuOpen)}
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
