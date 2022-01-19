
import Container from '@mui/material/Container';
import { Stack, Button } from '@mui/material';
import { ipcRenderer } from 'electron';


export const MenuButtons = () => {  
    const openDialog = () => {
      ipcRenderer.on("open-dialog", (_event, arg) => console.log(arg))
      ipcRenderer.send("open-dialog", "hello")

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
        <Button variant="outlined" onClick={openDialog}>Search Directory</Button>
      </Stack>
      </Container>
    )
}
