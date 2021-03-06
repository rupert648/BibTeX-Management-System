import { Container, Stack, Button } from '@mui/material';

interface ActionsStackProps {
  numbFiles: number,
  setModalOpen: Function
}

function ActionsStack({ numbFiles, setModalOpen }: ActionsStackProps) {
  return (
    <Container>
      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => setModalOpen(true)}>Merge Selected Files</Button>
      </Stack>
    </Container>
  );
}

export default ActionsStack;
