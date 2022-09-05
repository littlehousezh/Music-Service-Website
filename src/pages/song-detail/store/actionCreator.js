// Dispatch the number under the network request to the store
// Call API to save data in store
import * as actionTypes from './actionTypes'
import { getSongDeatilData } from '@/service/song-detail'

// List detail actioon
const changeSongDetailAction = (songDetail) => ({
  type: actionTypes.CHANGE_SONG_DETAIL,
  songDetail
})


// song detail network  (redux-thunk allows the action to be a function)
export const getSongDeailAction = (songDeatilId) => {
  return async(dispatch) => {
    // interface
    const result = await getSongDeatilData(songDeatilId)
    dispatch(changeSongDetailAction(result))
  }
}
