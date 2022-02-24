import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import Algorithms from './pages/Algorithms';

import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#FFFFFF',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/algorithms" element={<Algorithms />}/>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
