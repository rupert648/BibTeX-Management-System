import { Toolbar, InputAdornment, Input } from '@mui/material';
import { Search } from '@mui/icons-material';

interface FilterToolbarProps {
    setFilteredFiles: Function;
    foundFiles: Array<{fileName: string, checked: boolean}>;
}
  
function FilterToolbar({setFilteredFiles, foundFiles}: FilterToolbarProps) {

    const performFilter = (val: string) => {
        // simple includes - could use our matching algorithm!
        const filtered = foundFiles.filter((file) => file.fileName.includes(val));
        setFilteredFiles(filtered);
    }
    
    return (
        <Toolbar
            sx={{
                height: '10px',
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                bgcolor: (theme) => theme.palette.primary.main,
            }}
        >
            <Input
                sx={{
                    backgroundColor: 'white'
                }}
                placeholder='filter'
                onChange={(v) => performFilter(v.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                }
            />
        </Toolbar>
    );
};

export default FilterToolbar;