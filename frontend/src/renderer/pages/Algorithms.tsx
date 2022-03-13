import { useState} from 'react';
import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl, TextareaAutosize, Divider, Typography} from '@mui/material';
import { Container, Stack } from '@mui/material';

import ThresholdSlider from 'renderer/components/ThresholdSlider';
import ScoreArea from 'renderer/components/ScoreArea';

function Algorithms() {
    const [algorithmChoice, setAlgorithmChoice] = useState("levenshtein");
    const [value, setValue] = useState(0);
    const [string1, setString1] = useState("");
    const [string2, setString2] = useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setAlgorithmChoice(event.target.value as string);
    };

    const algorithms: Array<string> = [
        'damerau_levenshtein',
        'hamming',
        'levenshtein',
        'ngram',
        'jenson shannon vector'
    ];

    const displayValue = (): string => {
        switch (algorithmChoice) {
            case 'jenson shannon vector':
            case 'ngram':
                return (value / 100).toFixed(2);
            default: return value.toString();
        }
    }

    return (
        <div>
            <Container>
                <h1>Algorithm Sandbox</h1>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Algorithm Choice</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={algorithmChoice}
                        defaultValue="levenshtein"
                        label="algorithm choice"
                        onChange={handleChange}
                    >
                        {algorithms.map((alg) => <MenuItem value={alg}>{alg}</MenuItem>)}
                    </Select>
                </FormControl>

                <ThresholdSlider value={value} setValue={setValue} displayValue={displayValue} />
                <Divider />

                <Stack direction="row" spacing={2} sx={{
                    marginTop: "50px"
                }}>
                    <div style={{ width: "50%" }}>
                        <Typography>String 1</Typography>
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Enter a String"
                            style={{ width: "90%" }}
                            value={string1}
                            onChange={(event) => setString1(event.target.value)}
                        />
                    </div>
                    <div style={{ width: "50%" }}>
                        <Typography>String 2</Typography>
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Enter a string"
                            style={{ width: "90%" }}
                            value={string2}
                            onChange={(event) => setString2(event.target.value)}
                        />
                    </div>
                </Stack>
                <div style={{ marginTop: "10px" }}>
                    <Divider />
                </div>
                <ScoreArea algorithm={algorithmChoice} string1={string1} string2={string2} threshold={Number(displayValue())}/>
            </Container>
        </div>
    )
}

export default Algorithms;