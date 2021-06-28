import React, { useState } from "react";

import AppBar from "@material-ui/core/AppBar";
import CloseIcon from "@material-ui/icons/Close";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import logo from "../../assets/logoWhite.png";
import { useMainStyles } from "../../styles/layout/main";

interface MainLayoutProps {
  children: React.ReactNode;
}
export const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const classes = useMainStyles();
  const [open, setOpen] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="secondary"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Persistent drawer
          </Typography>
          <div className={classes.toolbarContainer}></div>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        color="primary"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaperClients,
        }}
      >
        <div className={clsx(classes.drawerHeader, classes.drawerLogoHeader)}>
          <img src={logo} alt="" height={100} />
        </div>
        <Divider />
      </Drawer>
      <Drawer
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="right"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      >
        <div className={classes.drawerHeader}>
          <IconButton
            color="inherit"
            aria-label="close drawer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={classes.menuButton}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
};
