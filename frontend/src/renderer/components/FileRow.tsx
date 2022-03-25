import { useState, useEffect } from 'react';
import path from 'path';
import { TableRow, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

interface FileCardProps {
  file: {
    fileName: string,
    checked: boolean
  };
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
  const [fileLength, setFileLength] = useState(0);

  // watch for updateChecked in order to set all to true or false
  useEffect(() => {
    file.checked = updateChecked
  }, [updateChecked]);

  const getFileName = () => {
    return path.basename(file.fileName);
  };

  const getFileLength = () => {
    ipcRenderer.on(`get-file-length-${index}`, (_event, arg) => {
      if (arg) {
        setFileLength(arg);
      }
    });

    ipcRenderer.send('get-file-length', { file: file.fileName , index });
  };

  const getNumberEntries = () => {
    ipcRenderer.on(`parse-bibtex-file-${index}`, (_event, arg) => {
      if (arg) {
        setEntries(arg.entries);
      }
      // TODO: error handling of non STATUS==='OK
    });

    ipcRenderer.send('parse-bibtex-file', { file: file.fileName, index });
  };

  useEffect(() => {
    getNumberEntries();
    getFileLength();
  }, [file]);

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
    setSelectedFile(file.fileName);
    setFileOpen(true);
  };

  const handleCheckboxChange = (event: any) => {
    const { checked } = event.target;
    file.checked = checked;

    if (checked) {
      // add to array
      setCheckedFiles([...checkedFiles, file.fileName]);
    } else {
      // remove from array
      setCheckedFiles(checkedFiles.filter((f) => f !== file.fileName));
    }
  };

  const rowClick = () => {
    const checked = !file.checked;
    file.checked = !file.checked;

    if (checked) {
      // add to array
      setCheckedFiles([...checkedFiles, file.fileName]);
    } else {
      // remove from array
      setCheckedFiles(checkedFiles.filter((f) => f !== file.fileName));
    }
  };

  return (
    <StyledTableRow
      sx={{ cursor: 'pointer'}}
      onClick={rowClick}
    >
      <StyledTableCell>
        <Checkbox
          id={`fileCheckBox_${index}`}
          size="small"
          checked={file.checked}
          onChange={handleCheckboxChange}
        />
      </StyledTableCell>
      <StyledTableCell component="th" scope="row">
        {getFileName()} 
      </StyledTableCell>
      <StyledTableCell align="right">{entries.length}</StyledTableCell>
      <StyledTableCell align="right">{fileLength} bytes</StyledTableCell>
      <StyledTableCell align="right">
        <button
          type="button"
          onClick={fileClicked}
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          View Contents
        </button>
      </StyledTableCell>
    </StyledTableRow>
  );
}

export default FileRow;
