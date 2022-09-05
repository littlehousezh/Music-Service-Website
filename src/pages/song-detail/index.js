import React, {memo, useEffect,} from 'react'
import {useDispatch} from 'react-redux'
import qs from 'query-string'
import AppNavBar from '@/components/nav-bar/index'
import {SonglistContent, SonglistWrapper} from './style'
import {getSongDeailAction} from './store/actionCreator'
import SongDetailLeft from './child-pages/song-detail-left'
// import SongDetailRight from './child-pages/song-detail-right'
import { useGlobalKeyboardEvent } from '../../hooks/change-state'

export default memo(function JMSonglist(props) {
  // props/state
  const {songlistId} = qs.parse(props.location.search) // Get the passed song list ID, and then generate a network request based on the ID

  // redux hook
  const dispatch = useDispatch()

  // other hook
  useEffect(() => {
    dispatch(getSongDeailAction(songlistId))
  }, [dispatch, songlistId])

  // custom hook
  useGlobalKeyboardEvent()// Global Registration ctrl+k Wake up drop-down slider

  // JSX
  return (
    <SonglistWrapper>
      {/* nevigation */}
      <AppNavBar/>
      <SonglistContent>
        {/* left side of list */}
        <SongDetailLeft/>
        {/* right side */}
        {/* <SongDetailRight/> */}
      </SonglistContent>
    </SonglistWrapper>
  )
})
