/* eslint-disable import/extensions */
import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import HomePage from './pages/HomePage';

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
  console.log('loading app');
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
