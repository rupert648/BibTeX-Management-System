import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Button, TableContainer, Table, TableRow, TableCell, TableBody } from '@mui/material';

interface ScoreAreaProps {
    algorithm: string,
    string1: string,
    string2: string,
    threshold: number,
}

function ScoreArea({ algorithm, string1, string2, threshold }: ScoreAreaProps) {
    const [score, setScore] = useState(0);

    const sendAlgRequest = (route: string) => {
        console.log(route);
        ipcRenderer.on(route, (_event, arg) => {
            if (arg) {
                console.log(arg);
              setScore(arg);
            }
          });
      
        ipcRenderer.send(route, { string1, string2 });
    }

    const calculateScore = () => {

        switch(algorithm) {
            case 'damerau_levenshtein':
                sendAlgRequest('damerau-levenshtein');
                break;
            case 'hamming': 
                sendAlgRequest('hamming');
                break;
            case 'levenshtein':
                sendAlgRequest('levenshtein');
                break;
            case 'jaro winkler':
                sendAlgRequest('jaroWinkler');
                break;
            case 'ngram':
                sendAlgRequest('ngram');
                break;
            case 'jenson shannon vector':
                sendAlgRequest('jenson-shannon-vector');
                break;
            default:
                setScore(0);
        }
    }

    useEffect(() => {
        console.log(threshold);
    }, [threshold])

    return (
        <div>
            <Button variant="outlined" sx={{ margin: "10px 0 10px 0" }} onClick={calculateScore}>Calculate Score</Button>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>Score</b>
                            </TableCell>
                            <TableCell align="right">{score}</TableCell>
                        </TableRow> 
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <b>Match?</b>
                            </TableCell>
                            <TableCell align="right">{score <= threshold ? 'true' : 'false'}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default ScoreArea;