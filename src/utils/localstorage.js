import { LOCAL_PLAYLIST_ID_KEY } from '@/common/constants'
import { LOCAL_CURRENT_SONG_INDEX_KEY } from '../common/constants'
/**
 * Add song id to local storage, if it exists, no longer add it
 * @param {Number} id song id
 * @param {String} key local storage key
 */
export function addPlaylistId(id, key = LOCAL_PLAYLIST_ID_KEY) {
  const songListId = localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key))
    : []
  if (id instanceof Array) {
    id.forEach(id => {
      !songListId.includes(id) && songListId.push(id)
    })
  } else if (typeof id === 'number') {
    // Local storage preservation includes no more duplicate additions
    if (!songListId.includes(id)) songListId.push(id)
    } else {
    throw Error('id can only be a number or an array type')
  }
  localStorage.setItem(key, JSON.stringify(songListId))
}

/**
 * Get song list id
 * @param {String} key
 * @returns {Array} Song list items id
 */
export function getPlaylistId(key = LOCAL_PLAYLIST_ID_KEY) {
  const songListId = localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key))
    : []
  return songListId
}

/**
 * deleted song ID
 * @param {Number or String} id Song ID to be deleted
 * @param {String} key
 */
export function removeSongId(id, key = LOCAL_PLAYLIST_ID_KEY) {
  const songListId = localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key))
    : []
  // Arrays have values & The id to be removed is found
  if (songListId.length && songListId.includes(id)) {
    songListId.splice(songListId.indexOf(id), 1)
  }
  localStorage.setItem(key, JSON.stringify(songListId))
}

/**
 * Clear all songs
 * @param {String} key
 */
export function removeAllSong(key = LOCAL_PLAYLIST_ID_KEY) {
  let songListId = localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key))
    : []
  // Arrays have values & The id to be removed is found
  if (songListId.length) {
    songListId.length = 0
  }
  localStorage.setItem(key, JSON.stringify(songListId))
}

/**
 * Reset this stored song list ID
 * @param {Array} idArr New song list array
 */
export function resetPlaylistId(idArr) {
  removeAllSong()
  idArr && idArr.forEach((id) => addPlaylistId(id))
}

// ------Remember the currently playing song Index------
/**
 * update song index
 * @param {Number} index song index
 * @param {*} key 
 */
export function setCurrentSongIndex(index, key = LOCAL_CURRENT_SONG_INDEX_KEY) {
    localStorage.setItem(key, index)
}

/**
 * Initial Storage
 * @param {Numebr} index song index
 * @param {String} key 
 */
export function initCurrentSongIndex(index = 0, key = LOCAL_CURRENT_SONG_INDEX_KEY) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, index)
  }
}

/**
 * Get song index
 * @param {String} key 
 * @returns Get song index
 */
export function getCurrentSongIndex(key = LOCAL_CURRENT_SONG_INDEX_KEY) {
  const currentIndex = JSON.parse(localStorage.getItem(key)) || 0
  return currentIndex
}
