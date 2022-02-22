/* eslint-disable import/extensions */
import React, { useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Checkbox,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { orange } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// eslint-disable-next-line import/no-unresolved
import FileRow from './FileRow';

interface SelectedFilesProps {
  foundFiles: Array<string>;
  setFileOpen: Function;
  setSelectedFile: Function;
  setCheckedFiles: Function;
  checkedFiles: Array<string>;
}

function SelectedFiles({
  foundFiles,
  setFileOpen,
  setSelectedFile,
  setCheckedFiles,
  checkedFiles,
}: SelectedFilesProps) {
  const [isChecked, setChecked] = useState(false);
  const [updateChecked, setUpdateChecked] = useState(false);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const createFileRow = (file: string, index: number) => (
    <FileRow
      file={file}
      StyledTableCell={StyledTableCell}
      setFileOpen={setFileOpen}
      setSelectedFile={setSelectedFile}
      setCheckedFiles={setCheckedFiles}
      checkedFiles={checkedFiles}
      index={index}
      updateChecked={updateChecked}
    />
  );

  const handleCheckboxChange = (event: any) => {
    const { checked } = event.target;
    setChecked(checked);

    setUpdateChecked(checked);
    if (checked) {
      setCheckedFiles(foundFiles);
    } else {
      setCheckedFiles([]);
    }
  };

  return (
    <div>
      <Container
        sx={{
          width: '100%',
          minHeight: '600px',
          maxHeight: '1000px',
          overflow: 'hidden',
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            width: '100%',
            maxHeight: '500px',
          }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <Checkbox
                    size="small"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    sx={{
                      color: orange[800],
                      '&.Mui-checked': {
                        color: orange[600],
                      },
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>FileName</StyledTableCell>
                <StyledTableCell align="right">File Entries</StyledTableCell>
                <StyledTableCell align="right">File Length</StyledTableCell>
                <StyledTableCell align="right">
                  <b>View File</b>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody 
              sx={{
                overflow: 'scroll',
              }}
            >
              {foundFiles.map(createFileRow)}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default SelectedFiles;
