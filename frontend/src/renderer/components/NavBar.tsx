import { useState } from 'react';
import { shell } from 'electron';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import GitHub from '@mui/icons-material/GitHub';

function NavBar() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const drawerWidth = 240;

  const redirrectToGithub = () => {
    shell.openExternal("https://github.com/rupert648/BibTeX-Management-System");
  }

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            BibTex Management Application
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        onClose={handleDrawerClose}
        anchor="left"
        open={open}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            justifyContent: 'flex-end',
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem button>
              <Link to={'/'} style={{ textDecoration: 'none', display: 'inline-flex'}}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={"Home"}
                />
              </Link>
            </ListItem>
            <ListItem button >
             <Link to={'/algorithms'} style={{ textDecoration: 'none', display: 'inline-flex'}}>
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText primary={"Algorithm Sandbox"} />
              </Link>
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem button onClick={redirrectToGithub}>
              <ListItemIcon>
                <GitHub />
              </ListItemIcon>
              <ListItemText primary={"Github"} />
            </ListItem>
        </List>
      </Drawer>
    </div>
  )
}

export default NavBar;