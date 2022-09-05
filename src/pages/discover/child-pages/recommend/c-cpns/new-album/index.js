import React, { memo, useEffect, useRef } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { getNewAlbumsAction } from '../../store/actionCreator'

import ThemeHeaderRcm from 'components/theme-header-rcm'
import AlbumCover from 'components/album-cover'
import { NewAlbumWrapper } from './style'
import { Carousel } from 'antd'

export default memo(function NewAlbum() {
  // redux hook
  const dispatch = useDispatch()
  const { newAlbums } = useSelector(
    state => ({
      newAlbums: state.getIn(['recommend', 'newAlbums']),
    }),
    shallowEqual
  )

  //  other hook
  const albumRef = useRef()
  // (New album)
  useEffect(() => {
    dispatch(getNewAlbumsAction())
  }, [dispatch])

  /* Rotation layout ideas:
      Two page rotation: 2page
      Add items to the page
  */
  return (
    <NewAlbumWrapper>
      <ThemeHeaderRcm title="new album" />
      <div className="content">
        <div className="inner">
          <Carousel dots={false} ref={albumRef}>
            {[0, 1].map(item => {
              return (
                <div key={item} className="page">
                  {/* item * 5, (item+1) * 5   First traversal 0  5  Second traversal 5  10  */}
                  {newAlbums && newAlbums.slice(item * 5, (item + 1) * 5).map(cItem => {
                    return (
                      <AlbumCover
                        key={cItem.id}
                        info={cItem}
                        size={100}
                        width={118}
                        bgp="-570px"
                      >
                        {cItem.name}
                      </AlbumCover>
                    )
                  })}
                </div>
              )
            })}
          </Carousel>
        </div>
        <div
          className="sprite_02 arrow arrow-left"
          onClick={e => albumRef.current.prev()}
        ></div>
        <div
          className="sprite_02 arrow arrow-right"
          onClick={e => albumRef.current.next()}
        ></div>
      </div>
    </NewAlbumWrapper>
  )
})
