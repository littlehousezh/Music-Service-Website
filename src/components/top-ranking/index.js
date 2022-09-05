import React, { memo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { getSizeImage } from '@/utils/format-utils.js'

import { message } from 'antd'
import { TopRankingWrapper } from './style'
import {
  getSongDetailAction,
  changeFirstLoad,
} from '@/pages/player/store/actionCreator'
import { useAddPlaylist } from '../../hooks/change-music'
import { changeCurrentIndexAction } from '../../pages/discover/child-pages/toplist/store/actionCreator'

export default memo(function TopRanking(props) {
  // ranking-list effect requirements:
  // Mouse over hover effect on a line item Play button and add playlist and collection icons
  // props/state
  const { info, index } = props
  const { tracks = [] } = info
  // let localPlayList = [] // 

  // redux hook
  const dispatch = useDispatch()
  const { playList } = useSelector(
    state => ({
      playList: state.getIn(['player', 'playList']),
    }),
    shallowEqual
  )

  // other handle
  // play music
  const playMusic = (e, item) => {
    // Block hyperlink
    e.preventDefault()
    // dispatch action songs detail
    dispatch(getSongDetailAction(item.id))
    // Not first load, play music
    dispatch(changeFirstLoad(false))
    //#Set up local storage (not done yet)
    // localPlayList.push(item.id)
    // localStorage.setItem('localPlayList', JSON.stringify(localPlayList))
    //#endregion
  }

  // Add to playlist (using custom hook)
  const addPlaylist = useAddPlaylist(playList,message)

  // function
  const toLink = (e) => {
    e.preventDefault()
    dispatch(changeCurrentIndexAction(index))
    props.to.push(`/discover/ranking?id=${info.id}`)
  }

  return (
    <TopRankingWrapper>
      <div className="ranking-header">
        <div className="image">
          <img src={getSizeImage(info.coverImgUrl, 80)} alt="" />
          <div className="image_cover ">
            {info.name}
          </div>
        </div>
        <div className="tit">
          <div>
            <h3>{info.name}</h3>
          </div>
          <div className="btn">
            <a href="/discover/recommend" className="no-link sprite_02 text-indent play">
              Play
            </a>
            <a href="/discover/recommend" className="no-link sprite_02 text-indent favourite">
              Collection
            </a>
          </div>
        </div>
      </div>
      <div className="ranking-list">
        {tracks &&
          tracks.length > 0 &&
          tracks.slice(0, 10).map((item, index) => {
            return (
              <div key={item.id} className="list-item">
                <div className="number">{index + 1}</div>
                <a href="/play" className="song-name text-nowrap" onClick={e => playMusic(e, item)}>
                  {item.name}
                </a>
                <div className="oper">
                  <a
                    href="/discover/recommend"
                    className="sprite_02 btn play"
                    onClick={e => playMusic(e, item)}
                  >
                    {item.name}
                  </a>
                  <a
                    href="/discover/recommend"
                    className="sprite_icon2 btn addto"
                    onClick={e => addPlaylist(e,item.id)}
                  >
                    {item.name}
                  </a>
                  <a href="/play" className="no-link sprite_02 btn favourite">
                    {item.name}
                  </a>
                </div>
              </div>
            )
          })}
      </div>
      <div className="ranking-footer">
        <a href="/all" className="show-all" onClick={(e) => toLink(e)}>
          More&gt;
        </a>
      </div>
    </TopRankingWrapper>
  )
})
