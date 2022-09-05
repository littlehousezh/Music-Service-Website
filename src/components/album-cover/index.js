import React, { memo } from 'react'

import { getSizeImage } from '@/utils/format-utils.js'

import { AlbumCoverWrapper } from './style'

export default memo(function AlbumCover(props) {
  // pass the component as default: width height  
  // Use utility functions to limit the size of images
  const { info, size = 130, width = 153, bgp = "-845px" } = props

  return (
    <AlbumCoverWrapper width={width} bgp={bgp} size={size}>
      <div className="album-image">
        <img src={getSizeImage(info.picUrl, size)} alt={info.name} />
        <a href="/discover/recommend" className="no-link image_cover cover">{info.name}</a>
      </div>
      <div className="album-name text-nowrap">{info.name}</div>
      <div className="artist text-nowrap">{info.artist.name}</div>
    </AlbumCoverWrapper>
  )
})
