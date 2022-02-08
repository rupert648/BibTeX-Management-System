/* eslint-disable import/extensions */
import React, { useState } from 'react';
import { Stack, Divider } from '@mui/material';

import HomeSubtitle from '../components/HomeSubtitle';
import ActionsStack from '../components/ActionsStack';
import FilePage from './FilePage';
import FilePageMenuBar from '../components/FilePageMenuBar';
import HomePageMenuBar from '../components/HomePageMenuBar';
import SelectedFiles from '../components/SelectedFiles';

function HomePage() {
  const [foundFiles, setFoundFiles] = useState([]);
  const [fileOpen, setFileOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [checkedFiles, setCheckedFiles] = useState([]);

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
      <Divider />
      <ActionsStack />
    </Stack>
  );
}

export default HomePage;
