import React from 'react';
import { Container } from '@mui/material';

interface HomeSubtitleProps {
  text: string;
}

function HomeSubtitle({ text }: HomeSubtitleProps) {
  return (
    <Container
      sx={{
        width: '100%',
        maxHeight: '300px',
        padding: '15px 0 15px 0',
      }}
    >
      <p>{text}</p>
    </Container>
  );
}

export default HomeSubtitle;
