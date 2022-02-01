import path from 'path';
import { useState, useEffect } from 'react';
import { TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

import backend from 'backend';

type FileCardProps = {
    file: string;
    index: Number;
    StyledTableCell: Function;
}

export const FileRow = ({file, index, StyledTableCell}: FileCardProps) => {
    const [entries, setEntries] = useState([]);

    const getFileName = () => path.basename(file); 

    const getFileLength = () => backend.getFileSize(file);

    const getNumberEntries = () => {
        let results = backend.parseBibTexFile(file);
        console.log(results);
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

    return (
        <StyledTableRow key={index} >
          <StyledTableCell component="th" scope="row">{getFileName()}</StyledTableCell>
          <StyledTableCell align="right">{entries.length}</StyledTableCell>
          <StyledTableCell align="right">{getFileLength()}</StyledTableCell>
          <StyledTableCell align="right">button</StyledTableCell>
        </StyledTableRow>   
    )
}