import { AppBar, Container, Toolbar, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >   
                    <Link to='/'>Merge Files</Link>
                </Button>
                <Button
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    <Link to='/algorithms'>Matching Algorithms</Link>
                </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    )
}

export default NavBar;