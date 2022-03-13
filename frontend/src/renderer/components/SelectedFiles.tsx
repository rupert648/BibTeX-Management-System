/* eslint-disable no-unused-vars */
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
  TablePagination,
  TableFooter,
  IconButton,
  Box,
} from '@mui/material';
import {
  LastPage, FirstPage, KeyboardArrowRight, KeyboardArrowLeft,
} from '@mui/icons-material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useTheme } from '@mui/system';
import { tableCellClasses } from '@mui/material/TableCell';
import { orange } from '@mui/material/colors';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// eslint-disable-next-line import/no-unresolved
import FileRow from './FileRow';
import EnhancedTableToolbar from './EnhancedTableToolbar';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const {
    count, page, rowsPerPage, onPageChange,
  } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
}

interface SelectedFilesProps {
  foundFiles: Array<{fileName: string, checked: boolean}>;
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - foundFiles.length) : 0;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const createFileRow = (file: any, index: number) => {
    return (
      <FileRow
        key={index}
        file={file}
        StyledTableCell={StyledTableCell}
        setFileOpen={setFileOpen}
        setSelectedFile={setSelectedFile}
        setCheckedFiles={setCheckedFiles}
        checkedFiles={checkedFiles}
        index={index}
        updateChecked={updateChecked}
      />
    )
  };

  const handleCheckboxChange = (event: any) => {
    const { checked } = event.target;
    setChecked(checked);

    setUpdateChecked(!checked);
    if (checked) {
      setCheckedFiles(foundFiles.map(f => f.fileName));
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
        <Paper
          sx={{
            width: '100%',
            maxHeight: '500px',
          }}
        >
        <EnhancedTableToolbar numSelected={checkedFiles.length} setCheckedFiles={setCheckedFiles} setChecked={setChecked} />
        <TableContainer >
          <Table stickyHeader sx={{ minWidth: 700 }} aria-label="customized table">
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
              {
                (rowsPerPage > 0
                  ? foundFiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : foundFiles).map(createFileRow)
              }
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={foundFiles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableFooter>
          </Table>
        </TableContainer>
        </Paper>
      </Container>
    </div>
  );
}

export default SelectedFiles;
