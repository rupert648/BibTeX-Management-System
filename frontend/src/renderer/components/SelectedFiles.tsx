import {
  Container, 
  Table, 
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  TableRow
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import { FileRow } from './FileCard';

interface SelectedFilesProps {
  foundFiles: Array<string>;
  setFileOpen: Function;
  setSelectedFile: Function;
}

export const SelectedFiles = ({foundFiles, setFileOpen, setSelectedFile}: SelectedFilesProps) => {

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

    const createFileRow = (file: string, index: Number) => {
      return (
        <FileRow 
          file={file}
          StyledTableCell={StyledTableCell}
          setFileOpen={setFileOpen}
          setSelectedFile={setSelectedFile}
        />
      )
    }

    return (
        <div>
          <Container 
            sx={{
              width: "100%",
              minHeight: "600px",
              maxHeight: "1000px",
              overflow: "hidden"
            }}
          > 
            <TableContainer component={Paper} sx={{
              width: "100%",
              overflow: "hidden",
            }}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>FileName</StyledTableCell>
                    <StyledTableCell align="right">File Entries</StyledTableCell>
                    <StyledTableCell align="right">File Length</StyledTableCell>
                    <StyledTableCell align="right"><b>View File</b></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    foundFiles.map(createFileRow)
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </div>
      );
}