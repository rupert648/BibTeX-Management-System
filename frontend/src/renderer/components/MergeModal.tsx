import React, { useState } from 'react';
import {
  Modal, Box, TextField, Button, Stack, TableRow, TableCell, Table, TableBody,
} from '@mui/material';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

interface MergeModalProps {
  modalOpen: boolean,
  setModalOpen: Function;
  checkedFiles: Array<string>;
}

function MergeModal({ modalOpen, setModalOpen, checkedFiles }: MergeModalProps) {
  const [filePath, setFilePath] = useState('');
  const [mergeError, setMergeError] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState(false);

  const openDialog = () => {
    ipcRenderer.on('select-file', (_event, arg) => {
      if (arg && !arg.cancelled) {
        // assume one filePath
        setFilePath(arg.filePaths[0]);
      }
    });
    ipcRenderer.send('select-file', '');
  };

  const attemptToMerge = () => {
    setMergeError(false);
    setMergeSuccess(false);

    if (!filePath) {
      setMergeError(true);
      return;
    }

    ipcRenderer.on('merge-response', (_event, arg) => {
      if (arg && arg.status === 'OK') {
        setMergeSuccess(true);
      } else {
        setMergeError(true);
      }
    });

    ipcRenderer.send('merge', { files: checkedFiles, resultPath: filePath });
  };

  const getFirst5 = () => {
    const first5 = checkedFiles.slice(0, 6);

    return first5.map((file) => (
      <TableRow>
        <TableCell>
          {path.parse(file).base}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(!modalOpen)}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}
      >
        <Stack spacing={2}>
          <h3>You wish to merge the following files</h3>
          <Table>
            {
              checkedFiles.length > 5 ? (
                <caption>{`... plus ${checkedFiles.length - 5} more`}</caption>
              ) : null
            }
            <TableBody>
              {getFirst5()}
            </TableBody>
          </Table>
          <Button variant="outlined" onClick={openDialog}>
            Select File
          </Button>
          <TextField
            label="Selected File Path"
            value={path.parse(filePath).base}
            sx={{
              width: '100%',
            }}
            disabled
            variant="outlined"
          />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="success" onClick={attemptToMerge}>Merge</Button>
            <Button variant="contained" color="error" onClick={() => setModalOpen(!modalOpen)}>Cancel</Button>
          </Stack>
        </Stack>
        {
          mergeError
          && <div>Error merging these files</div>
        }
        {
          mergeSuccess
          && (
          <Box
            sx={{
              position: 'relative',
              float: 'left',
              fontSize: '15px',
              lineHeight: '16px',
              overflow: 'hidden',
            }}
          >
            <p>Successfully Merged the Files</p>
          </Box>
          )
        }
      </Box>
    </Modal>
  );
}

export default MergeModal;
