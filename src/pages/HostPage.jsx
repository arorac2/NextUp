import { React, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../styles/HostPage.css';
// import SideMenu from '../components/SideMenu';
import { useParams } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
// import QRCodeDisplay from '../components/QRCodeDisplay';
import HostNavBar from '../components/HostNavBar';
import QRCodeModal from '../components/QRModal';
import Lottie from 'lottie-react';
import musicAnimation from '../lotties/music.json';

const HostPage = () => {
  const { userId } = useParams();
  const [playlist, setPlaylist] = useState([]);
  const [nowPlaying, setNowPlaying] = useState({});
  const [playing, setPlaying] = useState(false);
  const [playingArtist, setPlayingArtist] = useState('');
  const [playingAlbum, setPlayingAlbum] = useState('');
  const [playColour, setPlayColour] = useState('clicked');
  const [pauseColour, setPauseColour] = useState('');
  const [qrcodeModalOpen, setQRCodeModalOpen] = useState(false);
  const searchResultsRef = useRef();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchInput.length > 0) {
      axios
        .get(`https://api.nextup.rocks/events/${userId}/search/${searchInput}`)
        .then((res) => {
          const songs = res.data; // adjust this as needed depending on your API response structure
          console.log(songs.tracks);
          setSearchResults(songs.tracks);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchResultsRef, setSearchResults]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`https://api.nextup.rocks/events/${userId}/playlist`);
        const { playlist, currentlyPlaying } = response.data;
        setPlaylist(playlist.queue);
        setNowPlaying(currentlyPlaying);

        if (!currentlyPlaying.artists) {
          setPlaying(false);
        }
        if (currentlyPlaying && currentlyPlaying.artists && currentlyPlaying.artists.length > 0) {
          setPlaying(true);
          setPlayingArtist(currentlyPlaying.artists[0].name);
        }

        if (currentlyPlaying && currentlyPlaying.artists && currentlyPlaying.artists.length > 0) {
          setPlayingAlbum(currentlyPlaying.album.name);
        }
      } catch (error) {
        console.error('Failed to fetch playlist:', error);
      }
    };

    fetchPlaylist();
    const intervalId = setInterval(fetchPlaylist, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handlePlayClick = async () => {
    try {
      const response = await axios.get(`https://api.nextup.rocks/events/${userId}/resume`);
      console.log(response.data);
      setPlayColour('clicked');
      setPauseColour('');
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handlePauseClick = async () => {
    try {
      const response = await axios.get(`https://api.nextup.rocks/events/${userId}/pause`);
      console.log(response.data);
      setPauseColour('clicked');
      setPlayColour('');
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handleDeleteClick = async (songId) => {
    try {
      const response = await axios.delete(
        `https://api.nextup.rocks/events/${userId}/songs/${songId}`,
      );
      console.log(response.data);
      // Perform any necessary update to the playlist state
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };

  const handlePartyClick = async () => {
    try {
      const response = await axios.get(`https://api.nextup.rocks/events/${userId}/start`);
      console.log(response.data);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  const handleQRCodeModalClose = () => {
    setQRCodeModalOpen(false);
  };

  return (
    <div className='host-page'>
      <header className='host-page-header'>
        <HostNavBar userId={userId} />
        <h1>{`Welcome ${userId}`}</h1>
      </header>
      {/* <SideMenu /> */}
      <QRCodeModal
        open={qrcodeModalOpen}
        onClose={handleQRCodeModalClose}
        value={`https://nextup.rocks/event/${userId}`}
        userId={userId}
      />
      <section className='host-page-playlist'>
        <div style={{ position: 'relative' }}>
          <TextField
            label='Search'
            variant='outlined'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ width: '400px' }}
          />
          <div
            ref={searchResultsRef}
            style={{
              position: 'absolute',
              width: '100%',
              maxHeight: '200px',
              overflow: 'auto',
              backgroundColor: '#fff',
              zIndex: 1,
              display: searchInput.length > 0 && searchResults.length > 0 ? 'block' : 'none',
            }}
          >
            <List>
              {searchResults.map((song) => (
                <ListItem key={song.id}>
                  <div>
                    <div>{song.name}</div>
                    <div style={{ paddingLeft: '20px' }}>{song.artists[0].name}</div>
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
        </div>
        <Button
          variant='contained'
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: 'white',
              color: 'black',
            },
          }}
          onClick={handlePartyClick}
        >
          Start the party
        </Button>
        <h2 style={{ display: 'flex', alignItems: 'center' }}>
          Now Playing
          <div style={{ marginLeft: '10px' }}>
            <Lottie
              animationData={musicAnimation}
              style={{ width: '35px', height: '35px' }} // You forgot to mention the height
              setSpeed={playing ? 0 : 20}
            />
          </div>
        </h2>

        <div className='host-page-song-details'>
          <ListItemText
            primary={nowPlaying?.name || 'Unknown Track'}
            secondary={`${playingArtist || 'Unknown Artist'} - ${playingAlbum || 'Unknown Album'}`}
          />
        </div>
        <div className='host-page-avatars'>
          <ListItemAvatar>
            <Avatar className={playColour === 'clicked' ? 'playing' : ''}>
              <PlayCircleIcon onClick={handlePlayClick} />
            </Avatar>
          </ListItemAvatar>
          <ListItemAvatar>
            <Avatar className={pauseColour === 'clicked' ? 'paused' : ''}>
              <PauseCircleIcon onClick={handlePauseClick} />
            </Avatar>
          </ListItemAvatar>
        </div>
        <h2>Your Playlist</h2>
        <List>
          {playlist &&
            playlist.map((item) => {
              const track = item?.Track;
              const artist = track?.Artist?.name;
              const album = track?.Album?.name;
              return (
                <ListItem key={item.id} className='host-page-song-item'>
                  <div className='host-page-song-details'>
                    <ListItemText
                      primary={track?.name || 'Unknown Track'}
                      secondary={`${artist || 'Unknown Artist'} - ${album || 'Unknown Album'}`}
                    />
                  </div>
                  <div className='host-page-avatars'>
                    <ListItemAvatar>
                      <Avatar>
                        <DeleteIcon onClick={() => handleDeleteClick(item.id)} />
                      </Avatar>
                    </ListItemAvatar>
                  </div>
                </ListItem>
              );
            })}
        </List>
      </section>
      <footer className='footer'>
        <p>&copy; 2023 NextUp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HostPage;
