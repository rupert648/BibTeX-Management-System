import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Divider } from '@mui/material';
import { Stack, Button } from '@mui/material';

import './App.css';

import { MenuButtons } from './components/MenuButtons';


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
          minHeight: "600px",
          maxHeight: "1000px",
          backgroundColor: "rgb(220,220,220)",
          padding: "15px 0 15px 0",
          overflow: "hidden"
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

type HomeSubtitleProps = {
  text: string;
};

const HomeSubtitle = ({ text }: HomeSubtitleProps) => {
  return (
    <Container 
        sx={{
          width: "100%",
          maxHeight: "300px",
          padding: "15px 0 15px 0",
        }}
      > 
        <p>{text}</p>
      </Container>
  )
}

const ActionsStack = () => {
  return (
    <Container >
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" >Merge</Button>
        <Button variant="outlined" >Search for Duplicates</Button>
    </Stack>
    </Container>
  )
}

const AppLayout = () => {

  return (
      <Stack >
        <MenuButtons />
        <HomeSubtitle text="Found Files" />
        <SelectedFiles />
        <Divider />
        <ActionsStack />
      </Stack>
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
