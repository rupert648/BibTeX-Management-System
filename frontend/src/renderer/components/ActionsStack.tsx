import { Container, Stack, Button } from "@mui/material";

export const ActionsStack = () => {
    return (
        <Container >
            <Stack direction="row" spacing={2}>
                <Button variant="outlined" >Merge</Button>
                <Button variant="outlined" >Search for Duplicates</Button>
            </Stack>
        </Container>
    )
}
