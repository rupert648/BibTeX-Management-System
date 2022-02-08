import React from 'react';
import { Container } from '@mui/material';

interface HomeSubtitleProps {
  text: string;
  // eslint-disable-next-line react/require-default-props
  numberFilesFound?: Number;
  homePage: boolean;
}

function HomeSubtitle({ text, numberFilesFound, homePage }: HomeSubtitleProps) {
  const numberOfFilesText = () => {
    if (homePage) {
      if (numberFilesFound) {
        return numberFilesFound > 0
          ? `Showing ${numberFilesFound} result${
              numberFilesFound > 1 ? 's' : ''
            }`
          : 'No Results';
      }
    }
    return '';
  };

  return (
    <Container
      sx={{
        width: '100%',
        maxHeight: '300px',
        padding: '15px 0 15px 0',
      }}
    >
      <p>{text}</p>
      <p>{numberOfFilesText()}</p>
    </Container>
  );
}

export default HomeSubtitle;
