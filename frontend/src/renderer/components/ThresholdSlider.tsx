import { Box, Typography, Grid, Slider } from '@mui/material';

interface ThresholdSliderProps {
    value: number,
    setValue: Function,
    algorithm: string
}

function ThresholdSlider({ value, setValue, algorithm }: ThresholdSliderProps) {

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue);
    };

    // const algorithms: Array<string> = [
    //     'damerau_levenshtein',
    //     'hamming',
    //     'levenshtein',
    //     'ngram',
    //     'jenson shanning vector'
    // ];

    const displayValue = (): string => {
        switch (algorithm) {
            case 'jenson shanning vector':
            case 'ngram':
                return (value / 100).toFixed(2);
            default: return value.toString();
        }
    }

    return (
        <Box sx={{ width: 250 }}>
            <Typography id="input-slider" gutterBottom>
                Threshold Value
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                <Slider
                    value={typeof value === 'number' ? value : 0}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                />
                </Grid>
                <Grid item>
                    <span>{displayValue()}</span>
                </Grid>
            </Grid>
            </Box>
    )
}

export default ThresholdSlider;