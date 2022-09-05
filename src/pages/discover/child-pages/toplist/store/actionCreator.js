import * as actionTypes from './actionTypes'
import { getToplistInfo, getToplistDetail } from '@/service/toplist'

// Change the list data Action
const changeToplistAction = (toplistInfo) => ({
  type: actionTypes.CHANGE_TOPLIST_COUNT,
  toplistInfo,
})

// change current index Action
export const changeCurrentIndexAction = (index) => ({
  type: actionTypes.CHANGE_CURRENT_INDEX,
  index,
})

// Change the current song list of ID_Action
export const changeCurrentToplistIdAction = (id) => ({
  type: actionTypes.CHANGE_CURRENT_TOPLIST_ID,
  id,
})

// Change the list title details Action
const changeToplistTitleInfo = (titleInfo) => ({
  type: actionTypes.CHANGE_CURRENT_TOPLIST_TITLE_INFO,
  titleInfo,
})

// Change the list of different ranking Action
const changeCurrentToplist = (toplist) => ({
  type: actionTypes.CHANGE_CURRENT_TOPLIST,
  toplist,
})

// ranking network
export const getToplistInfoAction = () => {
  return (dispatch) => {
    getToplistInfo().then((res) => {
      dispatch(changeToplistAction(res.list))
    })
  }
}

// header of ranking network
export const getToplistTitleInfoAction = (id) => {
  return (dispatch) => {
    getToplistDetail(id).then((res) => {
      // Take out the ranking headers' detail information
      const {
        coverImgUrl,
        name,
        trackNumberUpdateTime,
        playCount,
        subscribedCount,
        commentCount,
        shareCount,
      } = res && res.playlist
      const toplistTitleInfo = {
        coverImgUrl,
        name,
        trackNumberUpdateTime,
        playCount,
        subscribedCount,
        commentCount,
        shareCount,
      }
      dispatch(changeToplistTitleInfo(toplistTitleInfo))
    })
  }
}

// List details information network
export const getToplistItemAction = (id) => {
  return (dispatch) => {
    getToplistDetail(id).then((res) => {
        // List details information
      const currentToplist = res && res.playlist && res.playlist.tracks
      dispatch(changeCurrentToplist(currentToplist))
    })
  }
}
