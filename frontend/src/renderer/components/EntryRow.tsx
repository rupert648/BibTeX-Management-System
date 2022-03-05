import { TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

interface EntryRowProps {
  entry: {
    entryType: string;
    name: string;
    fields?: [
      {
        fieldName: string;
        fieldValue: string;
      }
    ];
  };
  StyledTableCell: Function;
  setModalOpen: Function;
  setSelectedEntry: Function;
}

function EntryRow({ entry, StyledTableCell, setModalOpen, setSelectedEntry }: EntryRowProps) {
  const handleClick = () => {
    setSelectedEntry(entry);
    setModalOpen(true);
  }

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const getFieldValue = (valueName: string) => {
    let result = '-';

    if (entry.fields) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < entry.fields.length; i++) {
        const { fieldName, fieldValue } = entry.fields[i];

        if (fieldName.toLowerCase() === valueName) {
          result = fieldValue;
          break;
        }
      }
    }

    return result;
  };

  return (
    <StyledTableRow sx={{cursor: 'pointer'}} onClick={handleClick}>
      <StyledTableCell component="th" scope="row">
        {entry.name}
      </StyledTableCell>
      <StyledTableCell align="right">{entry.entryType}</StyledTableCell>
      <StyledTableCell align="right">{getFieldValue('author')}</StyledTableCell>
      <StyledTableCell align="right">{getFieldValue('title')}</StyledTableCell>
      <StyledTableCell align="right">{entry.fields?.length}</StyledTableCell>
    </StyledTableRow>
  );
}

export default EntryRow;
