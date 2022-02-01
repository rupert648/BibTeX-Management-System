
import {useState} from 'react'
import Container from '@mui/material/Container';
import { Stack, Button, TextField, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material'
import { ipcRenderer } from 'electron';

import backend from 'backend';

type MenuBarProps = {
  setFoundFiles: Function
};

export const MenuBar = ({setFoundFiles}: MenuBarProps) => {  
    const [directoryPath, setDirectoryPath] = useState("");

    const openDialog = () => {
      ipcRenderer.on("open-dialog", (_event, arg) => {
        if (arg && !arg.cancelled) {
          // assume one filePath
          setDirectoryPath(arg.filePaths[0])
        }
      })
      ipcRenderer.send("open-dialog", "hello")
    }

    const searchVolume = () => {
      if (!directoryPath) return;

      // console.log(x)
      let results = backend.searchVolume(directoryPath);
      
      if (results && results.length > 0) {
        setFoundFiles(results)
      }
    }

    return (
      <Container 
          sx={{
            width: "100%",
            maxHeight: "300px",
            padding: "15px 0 15px 0",
          }}
        > 
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" >Upload</Button>
        <Button variant="outlined" onClick={openDialog}>Select Directory</Button>
        <TextField 
          label="Selected Directory Path"
          value={directoryPath}
          sx={{
            width: "500px"
          }}
          disabled={true}
          variant="outlined"
        />
        <IconButton onClick={searchVolume}><Search /></IconButton>
      </Stack>
      </Container>
    )
}
