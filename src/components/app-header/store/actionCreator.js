import { getSearchSongData } from '@/service/theme-header';
import * as actionTypes from './actionType';

// Action: search songs
const changeSearchSongListAction = (songList) => ({
  type: actionTypes.CHANGE_SEARCH_SONG_LIST,
  songList,
});

// change focus state
export const changeFocusStateAction = state => ({
  type: actionTypes.CHANGE_FOCUS_STATE,
  state
})

// network: search songs
export const getSearchSongListAction = (searchStr) => {
  return (dispatch) => {
    getSearchSongData(searchStr).then((res) => {
      const songList = res.result && res.result.songs
      dispatch(changeSearchSongListAction(songList));
    });
  };
};
