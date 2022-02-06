import { useState, useEffect } from 'react';
import { Stack, Divider } from '@mui/material';

import { FilePage } from './FilePage';
import { MenuBar } from '../components/MenuBar';
import { SelectedFiles } from '../components/SelectedFiles'
import { HomeSubtitle } from 'renderer/components/HomeSubtitle';
import { ActionsStack } from 'renderer/components/ActionsStack';

export const HomePage = () => {
    const [foundFiles, setFoundFiles] = useState([]);
    const [fileOpen, setFileOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState("");

    // return section
    if (fileOpen) {
        return (
            <FilePage file={selectedFile} setFileOpen={setFileOpen}/>
        )
    } 

    return (
        <Stack >
            <MenuBar setFoundFiles={setFoundFiles} />
            <HomeSubtitle text="Found Files" numberFilesFound={foundFiles.length}/>
            <SelectedFiles 
                foundFiles={foundFiles}
                setFileOpen={setFileOpen}
                setSelectedFile={setSelectedFile}
            />
            <Divider />
            <ActionsStack />
        </Stack>
    )
    
}