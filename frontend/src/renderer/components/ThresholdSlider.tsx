import { Box, Typography, Grid, Slider } from '@mui/material';

interface ThresholdSliderProps {
    value: number,
    setValue: Function,
    displayValue: Function
}

function ThresholdSlider({ value, setValue, displayValue }: ThresholdSliderProps) {

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: 250, margin: '10px' }}>
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