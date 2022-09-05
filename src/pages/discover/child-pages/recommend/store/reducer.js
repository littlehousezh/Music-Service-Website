import { Map } from 'immutable'
import * as actionTypes from './actionTypes'

// Use Immutable to manage state in redux (modified `state` does not modify the original data structure, but returns the new data structure after modification)
const defaultState = Map({
  topBanners: [],
  hotRecommends: [],
  newAlbums: [],

  upRanking: {},
  newRanking: {},
  originRanking: {},

  settleSinger: []
})

function reducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.CHANGE_TOP_BANNER:
      return state.set('topBanners', action.topBanners)
    case actionTypes.CHANGE_HOT_RECOMMEND:
      return state.set('hotRecommends', action.hotRecommends)
    case actionTypes.CHANGE_NEW_ALBUMS:
      return state.set('newAlbums', action.newAlbums)

    case actionTypes.CHANGE_UP_RANKING:
      return state.set('upRanking', action.upRanking)
    case actionTypes.CHANGE_NEW_RANKING:
      return state.set('newRanking', action.newRanking)
    case actionTypes.CHANGE_ORIGIN_RANKING:
      return state.set('originRanking', action.originRanking)

    case actionTypes.CHANGE_SETTLE_SINGER: 
      return state.set('settleSinger', action.settleSinger)
    default:
      return state
  }
}

export default reducer
