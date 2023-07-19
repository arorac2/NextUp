import React, { useEffect, useState } from 'react';
import { DialogContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import PropTypes from 'prop-types';
import axios from 'axios';

const HistoryTab = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.nextup.rocks/events/${userId}/history`)
      .then((response) => {
        setHistory(response.data.history);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div className='history-modal'>
      <DialogContent>
        {history.length === 0 ? (
          <Typography>No songs played during the event.</Typography>
        ) : (
          <List>
            {history.map((song) => (
              <ListItem key={song.id}>
                <ListItemText
                  primary={song.Track?.name || 'Unknown Track'}
                  secondary={`${song.Track.Artist.name || 'Unknown Artist'} - ${
                    song.Track.Album.name || 'Unknown Album'
                  }`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </div>
  );
};

HistoryTab.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default HistoryTab;
