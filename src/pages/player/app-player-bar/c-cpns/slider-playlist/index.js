import React, { memo, useEffect, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import propTypes from 'prop-types';
import Sortable from 'sortablejs';
import PlaylistItem from './c-cpns/playlist-item';
import {
  SliderPlaylistHeader,
  SliderPlaylistMain,
  SliderPlaylistWrapper,
} from './style';
import { ClearOutlined, CloseOutlined, HeartOutlined } from '@ant-design/icons';
import {
  changePlaylistAndCount,
  getSongDetailAction,
  changePlayListAction,
  // changeSongIndexAction
} from '../../../store/actionCreator';
import LyricContent from './c-cpns/lyric-content';
import { removeAllSong , resetPlaylistId} from '@/utils/localstorage';

function SliderPlaylist(props) {
  // props/state
  const {
    isShowSlider,
    playlistCount,
    closeWindow,
    playMusic,
    changeSong,
  } = props;

  // redux hook
  const dispatch = useDispatch();
  const { currentSong, playList, currentSongIndex } = useSelector(
    (state) => ({
      currentSong: state.getIn(['player', 'currentSong']),
      playList: state.getIn(['player', 'playList']),
      currentSongIndex: state.getIn(['player', 'currentSongIndex']),
    }),
    shallowEqual
  );

  // other hook
  const playlistRef = useRef();
  // Song list drag and drop initialization
  useEffect(() => {
    const el = playlistRef.current.querySelector('.main-playlist');
    new Sortable(el, {
      sort: true,
      animation: 200,
      currentIndex: 0,
      onEnd:  function (evt)  {
        // The event occurs at the end of the drag and drop
        // tableData 
        let tempPlayList = playList;
        // See if you can get the current song object 👇
        const musicsId = []
        tempPlayList.splice(
          evt.newIndex,
          0,
          playList.splice(evt.oldIndex, 1)[0]
        );
        //  Changing the order of the playlist
        dispatch(changePlayListAction(tempPlayList));
        musicsId.push(...tempPlayList.map((item) => item.id))
        // Resetting the song column array
        resetPlaylistId(musicsId)
      },
    });
    
  }, [currentSongIndex, dispatch, playList, currentSong]);

  // other function
  // clear all songs
  const clearAllPlaylist = (e) => {
    e.preventDefault();
    removeAllSong()
    playList.splice(0, playList.length);
    dispatch(changePlaylistAndCount(playList));
  };

  // Click item to play music
  const clickItem = (index, item) => {
    // play music dispatch
    dispatch(getSongDetailAction(item.id));
    playMusic();
  };

  return (
    <SliderPlaylistWrapper
      style={{ visibility: isShowSlider ? 'visible' : 'hidden' }}
      // stop Propagation
      onClick={(e) => e.stopPropagation()}
    >
      <SliderPlaylistHeader>
        <div className="playlist-header-left">
          <h3 className="header-title">Play List({playlistCount})</h3>
          <div>
            <a
              href="/favorite"
              className="header-icon"
              onClick={(e) => e.preventDefault()}
            >
              <HeartOutlined />
              <span>Collect</span>
            </a>
            <a
              href="/clear"
              onClick={(e) => clearAllPlaylist(e)}
              className="header-icon"
            >
              <ClearOutlined />
              <span>Clear playlist</span>
            </a>
          </div>
        </div>
        <div className="playlist-header-right">
          <div className="song-name">{currentSong.name}</div>
          <div className="close-window" onClick={closeWindow}>
            <CloseOutlined />
          </div>
        </div>
      </SliderPlaylistHeader>
      <SliderPlaylistMain ref={playlistRef}>
        <div className="main-playlist">
          {playList &&
            playList.map((item, index) => {
              return (
                <PlaylistItem
                  key={item.id}
                  isActive={
                    (currentSongIndex ? currentSongIndex : 0) === index
                      ? 'active'
                      : ''
                  }
                  songName={item.name}
                  singer={item.ar[0].name}
                  duration={item.dt}
                  clickItem={() => clickItem(index, item)}
                  songId={item.id}
                  nextMusic={() => changeSong(1)}
                />
              );
            })}
        </div>
        <div className="main-line"></div>
        <LyricContent />
      </SliderPlaylistMain>
    </SliderPlaylistWrapper>
  );
}

SliderPlaylist.propTypes = {
  isShowSlider: propTypes.bool.isRequired,
  playlistCount: propTypes.number.isRequired,
};

export default memo(SliderPlaylist);
