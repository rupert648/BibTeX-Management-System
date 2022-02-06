import { useState, useEffect } from 'react';
import { 
    Stack,
    Button,
    Container,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import {EntryRow} from '../components/EntryRow'

interface FilePageParams {
    file: string;
    setFileOpen: Function;
}

type Entry = {
    entryType: string,
    name: string,
    fields?: [
      {
          fieldName: string,
          fieldValue: string
      }
  ]
}

// ignore warning
import backend from 'backend';

export const FilePage = ({file, setFileOpen}: FilePageParams) => {
    const [entries, setEntries] = useState([])

    useEffect(() => {
        // on load get entries
        let results = backend.parseBibTexFile(file);

        if (results && results.status === 'OK') {
            setEntries(results.entries);
        }
        // TODO: error handling
    }, []);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
    }));

    const createEntryRow = (entry: Entry) => {
        return (
            <EntryRow entry={entry} StyledTableCell={StyledTableCell}/>
        )
    }

    const entriesToMap = () => {
      if (!entries) return [];
      // only render first 10 for now
      return entries.slice(0, 10);
    }

    return (
        <Stack>
            <Button onClick={() => setFileOpen(false)}/>
            <Container 
            sx={{
              width: "100%",
              minHeight: "600px",
              maxHeight: "1000px",
              overflow: "scroll"
            }}
          > 
            <TableContainer component={Paper} sx={{
              width: "100%",
              overflow: "hidden",
            }}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Entry Name</StyledTableCell>
                    <StyledTableCell align="right">Entry Type</StyledTableCell>
                    <StyledTableCell align="right">Author</StyledTableCell>
                    <StyledTableCell align="right">Title</StyledTableCell>
                    <StyledTableCell align="right">Fields</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entriesToMap().map(createEntryRow)}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Stack>
    )
}