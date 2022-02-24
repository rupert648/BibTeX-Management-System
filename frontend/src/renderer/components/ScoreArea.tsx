import { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Typography } from '@mui/material';

interface ScoreAreaProps {
    algorithm: string,
    string1: string,
    string2: string,
}

function ScoreArea({ algorithm, string1, string2 }: ScoreAreaProps) {
    const [score, setScore] = useState(0);

    const sendAlgRequest = (route: string) => {
        ipcRenderer.on(route, (_event, arg) => {
            if (arg) {
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
            case 'ngram':
                sendAlgRequest('ngram');
                break;
            case 'jenson shanning vector':
                sendAlgRequest('jenson-shanning-vector');
                break;
            default:
                setScore(0);
        }
    }

    useEffect(() => {
        calculateScore();
    }, [string1, string2])

    return (
        <div>
            <Typography>
                Score:
            </Typography>
            <p>{score}</p>
        </div>
    )
}

export default ScoreArea;