import React, { memo, Suspense, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import routes from '@/router'
import { Skeleton } from 'antd'
import ThemeDialog from '@/components/theme-dialog/index'
import initLoginInfo from '@/config/token.js'
import { setLoginInfo, getLoginInfo } from '@/utils/secret-key'
import { getLoginProfileInfo } from '@/components/theme-login/store/actionCreator'
import { addPlaylistId, getCurrentSongIndex, getPlaylistId, initCurrentSongIndex } from '../../utils/localstorage'
import { SONG_PLAYLIST_ID as songplaylistId } from '@/common/constants'
import { getSongDetailArrayAction } from '../player/store/index'

export default memo(function APPWrapper() {
  // props/state
  const [isShow, setIsShow] = useState(false)

  // redux hook
  const dispatch = useDispatch()
  console.log('Initial Login~~~')

  // other handle
  // initialize
  const initLogin = () => {
    // Login information exists
    if (localStorage.getItem('loginInfo') != null) {
      const { username, password } = getLoginInfo('loginInfo')
      username && password
        ? dispatch(getLoginProfileInfo(username, password))
        : console.log('Default information for current login')
    }
    // Login information not exists
    else {
      setLoginInfo('loginInfo', initLoginInfo)
    }
  }
  initLogin()

  // Add default song ID (locally stored default song id)
  useEffect(() => {
    // songplaylistId.forEach((id) => addPlaylistId(id))
    addPlaylistId(songplaylistId)
    // Initialize song index
    initCurrentSongIndex()
  }, [])

  // Local storage to read song list IDs
  useEffect(() => {
    // getPlaylistId().forEach((id) => {
      // Get locals store songs index dynamically
      const index = getCurrentSongIndex()
      dispatch(getSongDetailArrayAction(getPlaylistId(), index))
    // })
  }, [dispatch])

  // other function
  const handleOk = () => {
    setIsShow(false)
  }

  const handleCancel = () => {
    setIsShow(false)
  }

  return (
    <>
      <Suspense fallback={<Skeleton active />}>{renderRoutes(routes)}</Suspense>
      <ThemeDialog
        controlShow={isShow}
        title="upload music"
        handleOk={handleOk}
        handleCancel={handleCancel}
      >
        <h2>Hello Dialog</h2>
        <h3>Upload Music</h3>
      </ThemeDialog>
      {/* <Button onClick={() => setIsShow(!isShow)}>点我</Button> */}
    </>
  )
})
