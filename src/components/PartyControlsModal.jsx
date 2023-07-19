import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
} from '@mui/material';
import ExportPlaylistButton from './ExportPlaylistButton';
import HistoryTab from './HistoryTab';
import PartyModal from './PartyModal';
import '../styles/PartyModal.css';

function PartyControlsModal({ open, onClose, userId, value, playlist }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className='party-control-modal'
      scroll='paper'
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
        },
      }}
      PaperProps={{ sx: { mt: '50px' } }}
    >
      <DialogTitle>
        <Box textAlign='center'>
          <Typography variant='h6'>
            Party Controls <br />
          </Typography>
        </Box>
      </DialogTitle>
      <Box>
        <Tabs value={activeTab} onChange={handleChangeTab} centered>
          <Tab label='Start the Party' />
          <Tab label='View Song History' />
          <Tab label='Export Playlist' />
        </Tabs>
        <Box>
          {activeTab === 0 && (
            <>
              <Typography>
                <PartyModal value={value} playlist={playlist} userId={userId} />
              </Typography>
            </>
          )}
          {activeTab === 1 && (
            <>
              <Typography>
                <HistoryTab userId={userId} />
              </Typography>
            </>
          )}
          {activeTab === 2 && (
            <>
              <DialogContent>
                <Typography>
                  Export your playlist to Spotify to save the songs from your event!
                </Typography>
                <ExportPlaylistButton userId={userId} />
              </DialogContent>
            </>
          )}
        </Box>
      </Box>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PartyControlsModal;
