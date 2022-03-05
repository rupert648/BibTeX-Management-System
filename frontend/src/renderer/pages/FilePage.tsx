/* eslint-disable import/extensions */
import React, { useState, useEffect } from 'react';
import {
  Stack,
  Button,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

import EntryRow from '../components/EntryRow';
import EntryModal from 'renderer/components/EntryModal';

interface FilePageParams {
  file: string;
  setFileOpen: Function;
}

type Entry = {
  entryType: string;
  name: string;
  fields?: [
    {
      fieldName: string;
      fieldValue: string;
    }
  ];
};

function FilePage({ file, setFileOpen }: FilePageParams) {
  const [entries, setEntries] = useState([]);

  // modal
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // on load get entries
    ipcRenderer.on('parse-bibtex-file-1', (_event, arg) => {
      if (arg && arg.status === 'OK') {
        setEntries(arg.entries);
      }
    });

    ipcRenderer.send('parse-bibtex-file', { file, index: 1 });
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const createEntryRow = (entry: Entry) => (
    <EntryRow entry={entry} StyledTableCell={StyledTableCell} setModalOpen={setModalOpen} setSelectedEntry={setSelectedEntry}/>
  );

  const entriesToMap = () => {
    if (!entries) return [];
    // only render first 10 for now
    // return entries.slice(0, 10);
    return entries;
  };

  return (
    <Stack>
      <Button onClick={() => setFileOpen(false)} > Go Back </Button>
      <Container
        sx={{
          width: '100%',
          minHeight: '600px',
          maxHeight: '1000px',
          overflow: 'scroll',
        }}
      >
        <Paper
          sx={{
            width: '100%',
            // maxHeight: '500px',
          }}
        >
          <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Entry Name</StyledTableCell>
                <StyledTableCell align="right">Entry Type</StyledTableCell>
                <StyledTableCell align="right">Author</StyledTableCell>
                <StyledTableCell align="right">Title</StyledTableCell>
                <StyledTableCell align="right">Fields</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody >{entriesToMap().map(createEntryRow)}</TableBody>
          </Table>
        </TableContainer>
        </Paper>
      </Container>
      <EntryModal modalOpen={modalOpen} setModalOpen={setModalOpen} selectedEntry={selectedEntry}/>
    </Stack>
  );
}

export default FilePage;
