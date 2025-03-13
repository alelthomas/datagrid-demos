import React from 'react';
import { Box, CssBaseline, Container, Typography } from '@mui/material';
import PTOCalendar from './components/PTOCalendar';
import './App.css';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <PTOCalendar />
        </Box>
      </Container>
    </>
  );
}

export default App;
