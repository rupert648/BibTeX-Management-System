import { Container, TextField } from '@mui/material';

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
      <TextField
          label="Selected File"
          value={text}
          sx={{
            width: '100%',
          }}
          disabled
          variant="outlined"
        />
    </Container>
  );
}

export default HomeSubtitle;
