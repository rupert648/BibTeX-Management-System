import { Toolbar, Typography, Tooltip, IconButton } from '@mui/material';
import {alpha} from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete';

interface EnhancedTableToolbarProps {
    numSelected: number;
}
  
function EnhancedTableToolbar({numSelected}: EnhancedTableToolbarProps) {
    return (
        <Toolbar
        sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
            bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
        }}
        >
        {numSelected > 0 ? (
            <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
            >
            {numSelected} selected
            </Typography>
        ) : (
            <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
            >
            Nutrition
            </Typography>
        )}
        {numSelected > 0 && (
            <Tooltip title="">
            <IconButton>
                <DeleteIcon />
            </IconButton>
            </Tooltip>
        )}
        </Toolbar>
    );
};

export default EnhancedTableToolbar;