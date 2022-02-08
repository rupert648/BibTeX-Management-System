import React from 'react';
import Container from '@mui/material/Container';
import { Stack, Button } from '@mui/material';

interface FilePageMenuBarProps {
  setFileOpen: Function;
}

function FilePageMenuBar({ setFileOpen }: FilePageMenuBarProps) {
  return (
    <Container
      sx={{
        width: '100%',
        maxHeight: '300px',
        padding: '15px 0 15px 0',
      }}
    >
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => setFileOpen(false)}>
          Go Back
        </Button>
      </Stack>
    </Container>
  );
}

export default FilePageMenuBar;
