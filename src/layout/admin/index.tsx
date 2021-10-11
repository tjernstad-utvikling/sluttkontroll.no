import React, { useState } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { LeftDrawer } from './leftDrawer';
import { RightDrawer } from '../main/rightDrawer';
import { TopBar } from './topBar';
import clsx from 'clsx';
import { useMainStyles } from '../../styles/layout/main';

interface AdminLayoutProps {
    children: React.ReactNode;
    module: 'users';
}
export const AdminLayout = ({
    children,
    module
}: AdminLayoutProps): JSX.Element => {
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
                module={module}
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
