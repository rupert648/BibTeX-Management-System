import { useState } from 'react';
import { Stack, Divider } from '@mui/material';

import { MenuBar } from '../components/MenuBar';
import { SelectedFiles } from '../components/SelectedFiles'
import { HomeSubtitle } from 'renderer/components/HomeSubtitle';
import { ActionsStack } from 'renderer/components/ActionsStack';

export const HomePage = () => {
    const [foundFiles, setFoundFiles] = useState([]);

    return (
        <Stack >
            <MenuBar setFoundFiles={setFoundFiles} />
            <HomeSubtitle text="Found Files" numberFilesFound={foundFiles.length}/>
            <SelectedFiles foundFiles={foundFiles}/>
            <Divider />
            <ActionsStack />
        </Stack>
    )
}