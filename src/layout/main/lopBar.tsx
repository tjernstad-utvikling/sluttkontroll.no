import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { useMainStyles } from "../../styles/layout/main";

interface TopBarProps {
  isOpenLeftDrawerOpen: boolean;
  toggleLeftDrawer: () => void;
  toggleRightDrawer: () => void;
}
export const TopBar = ({
  isOpenLeftDrawerOpen,
  toggleLeftDrawer,
  toggleRightDrawer,
}: TopBarProps) => {
  const classes = useMainStyles();
  return (
    <AppBar
      position="fixed"
      color="secondary"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: isOpenLeftDrawerOpen,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleLeftDrawer}
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
          onClick={toggleRightDrawer}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
