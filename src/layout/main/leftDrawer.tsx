import { alpha, styled } from '@mui/material/styles';

import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import InputBase from '@mui/material/InputBase';
import { KlientMenu } from '../../components/drawer';
import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';
import logo from '../../assets/logoWhite.png';
import { useClients } from '../../api/hooks/useKlient';
import { useMainStyles } from '../../styles/layout/main';
import { useState } from 'react';

interface LeftDrawerProps {
    isOpen: boolean;
}
export const LeftDrawer = ({ isOpen }: LeftDrawerProps) => {
    const { classes } = useMainStyles();
    const [searchString, setSearchString] = useState<string>();

    const clientData = useClients();

    return (
        <Drawer
            className={classes.drawer}
            variant="persistent"
            color="primary"
            anchor="left"
            open={isOpen}
            classes={{
                paper: classes.drawerPaperClients
            }}>
            <div
                className={clsx(
                    classes.drawerHeader,
                    classes.drawerLogoHeader
                )}>
                <img src={logo} alt="" height={100} />
            </div>
            <Divider />
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Søk"
                    inputProps={{ 'aria-label': 'Søk i kunder / lokasjoner' }}
                    value={searchString || ''}
                    onChange={(e) => setSearchString(e.target.value)}
                />
            </Search>
            <Divider />
            <KlientMenu
                isExternal={false}
                klienter={clientData.data}
                searchString={searchString}
            />
        </Drawer>
    );
};

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25)
    },

    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto'
    }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch'
        }
    }
}));
