import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Tabs, Tab
} from "@material-ui/core";

function Header({ selectedTab, handleTabChange }) {
  const [anchorEl, setAnchorEl] = useState(null); // Track the anchor element for the menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    // <AppBar position="static" color="primary">
    //   <Toolbar>
    //     <Typography variant="h6" style={{ flexGrow: 1 }}>
    //       MealMetrics 🍎
    //     </Typography>
    //     <Typography variant="h6" style={{ flexGrow: 1 }}>
    //       MealCreator 🍎
    //     </Typography>
    //     <IconButton edge="end" color="inherit">
    //       <img src="/logo.png" alt="Logo" style={{ height: "40px" }} />
    //     </IconButton>
    //   </Toolbar>
    // </AppBar>
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Find Nutrition Facts" />
          <Tab label="Create Meal" />
        </Tabs>
        <IconButton edge="end" color="inherit" onClick={handleMenuClick}>
          <img src="/logo.png" alt="Logo" style={{ height: "40px" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Menu Item 1</MenuItem>
          <MenuItem onClick={handleMenuClose}>Menu Item 2</MenuItem>
          {/* Add more menu items as needed */}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
