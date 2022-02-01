import { Container } from '@mui/material';

type HomeSubtitleProps = {
    text: string;
    numberFilesFound: Number;
};
  
export const HomeSubtitle = ({ text, numberFilesFound }: HomeSubtitleProps) => {
    return (
       <Container 
          sx={{
            width: "100%",
            maxHeight: "300px",
            padding: "15px 0 15px 0",
          }}
        > 
            <p>{text}</p>
            <p>
                {
                    numberFilesFound > 0 ?
                    `Showing ${numberFilesFound} result${numberFilesFound > 1 ? 's': ''}` :
                    'No Results'
                    
                }
            </p>
        </Container>
    )
}