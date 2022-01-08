import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import './App.css';
import { Stack, Button } from '@mui/material';

const MenuButtons = () => {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" >Upload</Button>
      <Button variant="outlined" >Search</Button>
    </Stack>
  )
}

const MyBox = () => {
  return (
    <Box 
      sx={{
        width: 150,
        height: 100,
        backgroundColor: 'primary.dark',
        '&:hover': {
          backgroundColor: 'primary.main',
          opacity: [0.9, 0.8, 0.7],
        },
      }}
    > 
      element
    </Box>
  )
}

const SelectedFiles = () => {
  return (
    <div>
      <Container 
        sx={{
          width: "100%",
          maxHeight: "300px",
          backgroundColor: "orange",
          padding: "15px 0 15px 0",
          overflow: "scroll"
        }}
      > 

      <Grid container spacing={{ xs: 2, md: 2 }}>
        {
          Array.from(Array.from(Array(13)).map((_, index) => (
            <Grid item xs={2} sm={2} md={2} key={index}>
              <MyBox />
            </Grid>
          )))
        }
      </Grid>
        
      </Container>
    </div>
  );
};

const AppLayout = () => {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <MenuButtons />
      </Grid>
      <Grid item xs={12} md={12}>
        <h3>Found Files</h3>
      </Grid>
      <Grid item xs={12} md={12}>
        <SelectedFiles />
      </Grid>
      <Grid item xs={12} md={12}>
        <h3 >Selected Files</h3>
      </Grid>
      <Grid item xs={12} md={12}>
        <SelectedFiles />
      </Grid>
    </Grid>
  )

}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}
