import React, { useState } from 'react';
import Container from '@mui/material/Container';
// eslint-disable-next-line object-curly-newline
import { Stack, Button, TextField, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

type HomePageMenuBarProps = {
  setFoundFiles: Function;
};

function HomePageMenuBar({ setFoundFiles }: HomePageMenuBarProps) {
  const [directoryPath, setDirectoryPath] = useState('');

  const openDialog = () => {
    ipcRenderer.on('open-dialog', (_event, arg) => {
      if (arg && !arg.cancelled) {
        // assume one filePath
        setDirectoryPath(arg.filePaths[0]);
      }
    });
    ipcRenderer.send('open-dialog', 'hello');
  };

  const searchVolume = () => {
    if (!directoryPath) return;

    ipcRenderer.on('search-volume', (_event, arg) => {
      if (arg) {
        setFoundFiles(arg);
      }
    });

    ipcRenderer.send('search-volume', directoryPath);
  };

  return (
    <Container
      sx={{
        width: '100%',
        maxHeight: '300px',
        padding: '15px 0 15px 0',
      }}
    >
      <Stack direction="row" spacing={2}>
        <Button variant="contained" size="small" color="primary">
          Upload
        </Button>
        <Button variant="outlined" onClick={openDialog}>
          Select Directory
        </Button>
        <TextField
          label="Selected Directory Path"
          value={directoryPath}
          sx={{
            width: '500px',
          }}
          disabled
          variant="outlined"
        />
        <IconButton onClick={searchVolume}>
          <Search />
        </IconButton>
      </Stack>
    </Container>
  );
}

export default HomePageMenuBar;
