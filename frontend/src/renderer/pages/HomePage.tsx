/* eslint-disable import/extensions */
import React, { useState, useEffect } from 'react';
import { Stack } from '@mui/material';

import HomeSubtitle from '../components/HomeSubtitle';
import ActionsStack from '../components/ActionsStack';
import FilePage from './FilePage';
import FilePageMenuBar from '../components/FilePageMenuBar';
import HomePageMenuBar from '../components/HomePageMenuBar';
import SelectedFiles from '../components/SelectedFiles';
import MergeModal from '../components/MergeModal';

function HomePage() {
  const [foundFiles, setFoundFiles] = useState([]);
  const [fileOpen, setFileOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [checkedFiles, setCheckedFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!fileOpen) setCheckedFiles([]);
  }, [fileOpen]);

  if (fileOpen) {
    return (
      <Stack>
        <FilePageMenuBar setFileOpen={setFileOpen} />
        <HomeSubtitle text={selectedFile} homePage={false} />
        <FilePage file={selectedFile} setFileOpen={setFileOpen} />
      </Stack>
    );
  }

  return (
    <Stack>
      <HomePageMenuBar setFoundFiles={setFoundFiles} />
      <HomeSubtitle
        text="Found Files"
        numberFilesFound={foundFiles.length}
        homePage
      />
      <SelectedFiles
        foundFiles={foundFiles}
        setFileOpen={setFileOpen}
        setSelectedFile={setSelectedFile}
        setCheckedFiles={setCheckedFiles}
        checkedFiles={checkedFiles}
      />
      <ActionsStack numbFiles={checkedFiles.length} setModalOpen={setModalOpen} />
      <MergeModal modalOpen={modalOpen} setModalOpen={setModalOpen} checkedFiles={checkedFiles} />
    </Stack>
  );
}

export default HomePage;
