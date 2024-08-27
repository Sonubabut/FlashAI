import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { MdMenu } from 'react-icons/md';
import './Sidebar.css';

const Sidebar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <div
      className="drawer"
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/" className="listItem">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/chat" className="listItem">
          <ListItemText primary="Legal Expert" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className="root">
      
        <Toolbar>
          <IconButton edge="start" className="menuButton" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MdMenu />
          </IconButton>
          <Typography variant="h6" className="title">
            <Link to="/">
              <img src="https://digitalt3.com/wp-content/uploads/2024/07/DT3-Bringing-Digital-AI-Together-Photoroom.png" alt="Logo" className="logo" />
            </Link>
          </Typography>
        </Toolbar>
   
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </div>
  );
};

export default Sidebar;
