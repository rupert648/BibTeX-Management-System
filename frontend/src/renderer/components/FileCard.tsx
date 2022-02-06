import path from 'path';
import { useState, useEffect } from 'react';
import { TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

import backend from 'backend';

interface FileCardProps {
    file: string;
    StyledTableCell: Function;
    setFileOpen: Function;
    setSelectedFile: Function
}

export const FileRow = ({file, StyledTableCell, setFileOpen, setSelectedFile}: FileCardProps) => {
    const [entries, setEntries] = useState([]);

    const getFileName = () => path.basename(file); 

    const getFileLength = () => backend.getFileSize(file);

    const getNumberEntries = () => {
        let results = backend.parseBibTexFile(file);
        if (results && results.status === 'OK') {
            setEntries(results.entries)
        }
    }

    useEffect(() => {
        getNumberEntries();
    }, [])
    
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const fileClicked = () => {
        console.log("what")
        setSelectedFile(file);
        setFileOpen(true);
    }

    return (
        <StyledTableRow >
          <StyledTableCell component="th" scope="row">{getFileName()}</StyledTableCell>
          <StyledTableCell align="right">{entries.length}</StyledTableCell>
          <StyledTableCell align="right">{getFileLength()}</StyledTableCell>
          <StyledTableCell align="right"><a onClick={fileClicked}>See More</a></StyledTableCell>
        </StyledTableRow>   
    )
}