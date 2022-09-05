import React, { memo, useEffect, useState, useRef, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { getSizeImage, formatDate, getPlayUrl } from '@/utils/format-utils.js';
import {
  // getSongDetailAction,
  changePlaySequenceAction,
  changeCurrentIndexAndSongAction,
  changeCurrentLyricIndexAction,
} from '../store/actionCreator';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { Slider, Tooltip, message } from 'antd';
import { DownloadOutlined, UndoOutlined } from '@ant-design/icons';
import SliderPlaylist from './c-cpns/slider-playlist';
import { Control, Operator, PlayerbarWrapper, PlayerInfo } from './stye';

export default memo(function JMAppPlayerBar() {
  // props/state
  const [currentTime, setCurrentTime] = useState(0); // Used to save the current playback time
  const [isShowBar, setIsShowBar] = useState(false); // Whether to display the volume play bar
  const [progress, setProgress] = useState(0); // Slider Progress
  const [isChanging, setIsChanging] = useState(false); // Is sliding?
  const [isPlaying, setIsPlaying] = useState(false); // is playing?
  const [isShowSlide, setIsShowSlide] = useState(false); // Whether to display the playlist

  // redux hook
  const dispatch = useDispatch();
  const {
    currentSong,
    playSequence,
    firstLoad,
    lyricList = [],
    currentLyricIndex,
    playlistCount,
  } = useSelector(
    (state) => ({
      currentSong: state.getIn(['player', 'currentSong']),
      playSequence: state.getIn(['player', 'playSequence']),
      firstLoad: state.getIn(['player', 'firstLoad']),
      lyricList: state.getIn(['player', 'lyricList']),
      currentLyricIndex: state.getIn(['player', 'currentLyricIndex']),
      playlistCount: state.getIn(['player', 'playListCount']),
    }),
    shallowEqual
  );

  // other hook
  const audioRef = useRef();

  // Set audio src
  useEffect(() => {
    audioRef.current.src = getPlayUrl(currentSong.id);
    // set volume
    audioRef.current.volume = 0.3;
    // If not loading for the first time: Play music
    if (!firstLoad) setIsPlaying(true + Math.random());
  }, [currentSong, firstLoad]);

  // Play music when switching songs
  useEffect(() => {
    isPlaying && audioRef.current.play();
  }, [isPlaying]);

  // other handle
  const picUrl = currentSong.al && currentSong.al.picUrl; // figure url
  const songName = currentSong.name; // song name
  const singerName = currentSong.ar && currentSong.ar[0].name; // author name
  const duration = currentSong.dt; // duration
  const songUrl = getPlayUrl(currentSong.id); // song URL

  // other function
  // clicking the play or pause button
  const playMusic = useCallback(() => {
    // set src
    setIsPlaying(!isPlaying);
    // play music
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
  }, [isPlaying]);

  // Song play trigger
  function timeUpdate(e) {
    // Not triggered when sliding the slider (no sliding by default)
    let currentTime = e.target.currentTime;
    if (!isChanging) {
      setCurrentTime(currentTime * 1000);
      setProgress(((currentTime * 1000) / duration) * 100);
    }

    // The current music is playing state (used to search music, click the item to play music when used)
    if (currentTime > 0.1 && currentTime < 0.5) setIsPlaying(true);

    // Get the currently playing lyrics
    let i = 0; //Index for getting lyrics
    // 2.Iterating through the lyrics array
    for (; i < lyricList.length; i++) {
      const item = lyricList[i];
      if (currentTime * 1000 < item.totalTime) {
        // 4.jump out
        break;
      }
    }
    // Optimize dispatch, if the index does not change, no dispatch will be performed
    if (currentLyricIndex !== i - 1) {
      dispatch(changeCurrentLyricIndexAction(i - 1));
    }

    // show lyric
    const lyricContent = lyricList[i - 1] && lyricList[i - 1].content;
    lyricContent &&
      message.open({
        key: 'lyric',
        content: lyricContent,
        duration: 0,
        className: 'lyric-css',
      });

    // If the playlist is displayed then the lyrics are not shown
    isShowSlide && message.destroy('lyric');
  }

  // Triggered when sliding the slider
  const sliderChange = useCallback(
    (value) => {
      // When sliding the slider: change the marker variable to false (touch move for changing state), this will not trigger onTimeUpdate (song play event)
      setIsChanging(true);
      // Change the "Current Play Time" to the number of milliseconds: 241840 (total milliseconds)   1 * 241840 / 1000 241.84 / 60  4.016667
      const currentTime = (value / 100) * duration;
      setCurrentTime(currentTime);
      //  Changing the progress bar value
      setProgress(value);
    },
    [duration]
  );

  // Triggered when finger is lifted
  const slideAfterChange = useCallback(
    (value) => {
      // Reset the current playback duration: value/100 * duration/ 1000 Get the "seconds" of the current playback
      const currentTime = ((value / 100) * duration) / 1000;
      audioRef.current.currentTime = currentTime;
      // Set the state of the current playback time, the setting is 'milliseconds', so you need *1000
      setCurrentTime(currentTime * 1000);
      setIsChanging(false);
      // Changing Playback Status
      setIsPlaying(true);
      // Play music
      audioRef.current.play();
    },
    [duration, audioRef]
  );

  // 改变播放列表是否显示
  const changePlaylistShow = useCallback(() => {
    setIsShowSlide(!isShowSlide);
  }, [isShowSlide]);

  // Change whether the playlist is displayed or not
  function changingVolume(value) {
    audioRef.current.volume = value / 100;
  }

  // Changing the playback order
  const changeSequence = () => {
    let currentSequence = playSequence;
    currentSequence++;
    if (currentSequence > 2) {
      currentSequence = 0;
    }
    dispatch(changePlaySequenceAction(currentSequence));
  };

  // Switching songs (click to play the next or previous music)
  const changeSong = (tag) => {
    // First determine whether music exists in the playlist, and then decide whether to play it or not
    if (playlistCount < 1) {
      message.error('Please add a playlist', 0.5);
      return;
    }
    // The action needs to be dispatched, so the specific logic is done in the actionCreator
    dispatch(changeCurrentIndexAndSongAction(tag));
    setIsPlaying(true + Math.random()); // Changing the play status icon
  };

  // Switch to the next song without playing music
  const nextMusic = (tag) => {
    // You need to send an action, so the specific logic is done in the actionCreator
    dispatch(changeCurrentIndexAndSongAction(tag));
    setIsPlaying(false);
  };

  // After the current song has finished playing
  function handleTimeEnd() {
    // Single song cycle
    if (playSequence === 2) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      // Play next song
      dispatch(changeCurrentIndexAndSongAction(1));
      // Changing Play Status
      setIsPlaying(true + Math.random());
    }
  }

  // Play Music
  const forcePlayMusic = () => {
    setIsPlaying(true + Math.random());
  };

  // rePlay Music
  const refreshMusic = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return (
    <PlayerbarWrapper className="sprite_player">
      <div className="w980 content">
        <Control isPlaying={isPlaying}>
          <button
            className="sprite_player pre"
            onClick={(e) => changeSong(-1)}
          ></button>
          <button className="sprite_player play" onClick={playMusic}></button>
          <button
            className="sprite_player next"
            onClick={(e) => changeSong(1)}
          ></button>
        </Control>
        <PlayerInfo>
          <NavLink
            to={{
              pathname: '/discover/song',
            }}
            className="image"
          >
            <img src={getSizeImage(picUrl, 35)} alt="" />
          </NavLink>
          <div className="play-detail">
            <div className="song-info">
              <NavLink to="/discover/song" className="song-name">
                {songName}
              </NavLink>
              <a href="/author" className="no-link singer-name">
                {singerName}
              </a>
            </div>
            <Slider
              defaultValue={0}
              value={progress}
              onChange={sliderChange}
              onAfterChange={slideAfterChange}
            />
          </div>
          <div className="song-time">
            <span className="now-time">{formatDate(currentTime, 'mm:ss')}</span>
            <span className="total-time">
              {' '}
              / {duration && formatDate(duration, 'mm:ss')}
            </span>
          </div>
        </PlayerInfo>
        <Operator playSequence={playSequence}>
          <div className="left">
            <Tooltip title="downloaf">
              <a
                download={currentSong && currentSong.name}
                target="_blank"
                rel="noopener noreferrer"
                href={songUrl}
              >
                <DownloadOutlined />
              </a>
            </Tooltip>
            <Tooltip title="replay">
              <UndoOutlined className="refresh" onClick={refreshMusic} />
            </Tooltip>
          </div>
          <div className="right sprite_player">
            <Tooltip title="volumn">
              <button
                className="sprite_player btn volume"
                onClick={() => setIsShowBar(!isShowBar)}
              ></button>
            </Tooltip>
            <Tooltip
              title={[
                'Sequential Play',
                'Random Play',
                'Single song loop',
              ].filter((item, index) =>
                index === playSequence ? item : undefined
              )}
            >
              <button
                className="sprite_player btn loop"
                onClick={(e) => changeSequence()}
              ></button>
            </Tooltip>
            <button
              className="sprite_player btn playlist"
              // Block event capture, the parent element click event, do not want to click the child element also trigger the event
              onClick={() => setIsShowSlide(!isShowSlide)}
            >
              <Tooltip title="play list">
                <span>{playlistCount}</span>
              </Tooltip>
              <CSSTransition
                in={isShowSlide}
                timeout={3000}
                classNames="playlist"
              >
                <SliderPlaylist
                  isShowSlider={isShowSlide}
                  playlistCount={playlistCount}
                  closeWindow={changePlaylistShow}
                  playMusic={forcePlayMusic}
                  changeSong={nextMusic}
                  isPlaying={isPlaying}
                />
              </CSSTransition>
            </button>
          </div>
          {/* Slide volumn bar */}
          <div
            className="sprite_player top-volume"
            style={{ display: isShowBar ? 'block' : 'none' }}
            onMouseLeave={() => {
              setIsShowBar(false);
            }}
          >
            <Slider vertical defaultValue={30} onChange={changingVolume} />
          </div>
        </Operator>
      </div>
      <audio
        id="audio"
        ref={audioRef}
        onTimeUpdate={timeUpdate}
        onEnded={handleTimeEnd}
        preload="auto"
      />
    </PlayerbarWrapper>
  );
});
