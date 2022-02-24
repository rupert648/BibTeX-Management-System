import { Box, Typography, Grid, Slider, Input } from '@mui/material';

interface ThresholdSliderProps {
    value: number,
    setValue: Function
}

function ThresholdSlider({ value, setValue }: ThresholdSliderProps) {

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue);
    };
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 100) {
            setValue(100);
        }
    };

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
                <Input
                    value={value}
                    size="small"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    inputProps={{
                        step: 5,
                        min: 0,
                        max: 100,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                    }}
                />
                </Grid>
            </Grid>
            </Box>
    )
}

export default ThresholdSlider;