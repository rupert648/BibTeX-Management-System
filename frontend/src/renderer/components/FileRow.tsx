import { useState, useEffect } from 'react';
import path from 'path';
import { TableRow, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

interface FileCardProps {
  file: string;
  StyledTableCell: Function;
  setFileOpen: Function;
  setSelectedFile: Function;
  checkedFiles: Array<string>;
  setCheckedFiles: Function;
  index: number;
  updateChecked: boolean;
}

function FileRow({
  file,
  StyledTableCell,
  setFileOpen,
  setSelectedFile,
  checkedFiles,
  setCheckedFiles,
  index,
  updateChecked,
}: FileCardProps) {
  const [entries, setEntries] = useState([]);
  const [isChecked, setChecked] = useState(false);
  const [fileLength, setFileLength] = useState(0);

  // watch for updateChecked in order to set all to true or false
  useEffect(() => {
    setChecked(updateChecked);
  }, [updateChecked]);

  const getFileName = () => path.basename(file);

  const getFileLength = () => {
    ipcRenderer.on(`get-file-length-${index}`, (_event, arg) => {
      if (arg) {
        setFileLength(arg);
      }
    });

    ipcRenderer.send('get-file-length', { file, index });
  };

  const getNumberEntries = () => {
    ipcRenderer.on(`parse-bibtex-file-${index}`, (_event, arg) => {
      if (arg && arg.status === 'OK') {
        setEntries(arg.entries);
      }
    });

    ipcRenderer.send('parse-bibtex-file', { file, index });
  };

  useEffect(() => {
    getNumberEntries();
    getFileLength();
  }, []);

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
    setSelectedFile(file);
    setFileOpen(true);
  };

  const handleCheckboxChange = (event: any) => {
    const { checked } = event.target;
    setChecked(checked);

    if (checked) {
      // add to array
      setCheckedFiles([...checkedFiles, file]);
    } else {
      // remove from array
      setCheckedFiles(checkedFiles.filter((f) => f !== file));
    }
  };

  const rowClick = () => {
    const checked = !isChecked;
    setChecked(!isChecked);

    if (checked) {
      // add to array
      setCheckedFiles([...checkedFiles, file]);
    } else {
      // remove from array
      setCheckedFiles(checkedFiles.filter((f) => f !== file));
    }
  };

  return (
    <StyledTableRow
      sx={{ cursor: 'pointer' }}
      onClick={rowClick}
    >
      <StyledTableCell>
        <Checkbox
          id={`fileCheckBox_${index}`}
          size="small"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
      </StyledTableCell>
      <StyledTableCell component="th" scope="row">
        {getFileName()}
      </StyledTableCell>
      <StyledTableCell align="right">{entries.length}</StyledTableCell>
      <StyledTableCell align="right">{fileLength}</StyledTableCell>
      <StyledTableCell align="right">
        <button
          type="button"
          onClick={fileClicked}
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          See More
        </button>
      </StyledTableCell>
    </StyledTableRow>
  );
}

export default FileRow;
