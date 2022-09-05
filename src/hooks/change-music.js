import { useDispatch } from "react-redux"
import { getAddSongDetailAction } from '@/pages/player/store/actionCreator'
import { getFindIdIndex } from '@/utils/math-utils'

/**
 * Call this function: pass the playlist and message components, 
 * return a function to be called for the composition event
 * @param {Array} playlist redux save playlist
 * @param {Message} message Ant design: Message component - for pop-up windows
 */
export function useAddPlaylist(playlist, message) {
  const dispatch = useDispatch()
  return (e, id) => {
    // Block hyperlink jumps
    e.preventDefault && e.preventDefault()
    // Get song details, add to playlist
    dispatch(getAddSongDetailAction(id))
    // Prompt to add success or failure
    const index = getFindIdIndex(playlist, id)
    switch (index) {
      case -1:
        message.success({ content: 'Add Successful' })
        break
      default:
        message.success({ content: "Can't add duplicate songs" })
    }
  }
}