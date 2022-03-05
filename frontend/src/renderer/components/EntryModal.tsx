import { Modal, Box, TableContainer, Table, TableHead, Paper, TableRow, TableCell, TableBody } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

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

interface EntryModalProps {
    modalOpen: boolean,
    setModalOpen: Function,
    selectedEntry: Entry | null
}


function EntryModal({modalOpen, setModalOpen, selectedEntry}: EntryModalProps) {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
        maxWidth: '100%'
      }));

    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <TableContainer component={Paper} sx={{maxWidth: '70%', margin: 'auto', marginTop: '25%', maxHeight: '500px', overflowX: 'scroll'}}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell>Field Name</StyledTableCell>
                            <StyledTableCell>Field Value</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {selectedEntry && selectedEntry.fields && selectedEntry.fields.map((row) => (
                            <TableRow
                                key={row.fieldName}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell component="th" scope="row">
                                    {row.fieldName}
                                </StyledTableCell>
                                <StyledTableCell >{row.fieldValue}</StyledTableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
            </Modal>
        </div>
    )
}

export default EntryModal;