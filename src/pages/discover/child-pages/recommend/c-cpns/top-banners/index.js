// 1. Third Party Library
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'

// 2. Functional components
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getTopBannersAction } from '../../store/actionCreator'

// 3. Imported components
import { Carousel } from 'antd'
import { BannerControl, BannerLeft, BannerRight, BannerWrapper } from './style'

export default memo(function TopBanners() {
  // In-component state
  const [currentIndex, setCurrentIndex] = useState(0)

  // redux Hook: Component and redux association: getting data and performing operations
  const dispatch = useDispatch()
  const { topBanners } = useSelector(
    state => ({
      // topBanners: state.get('recommend').get('topBanners')
      // Get redux-reducer convert to Immutable state
      topBanners: state.getIn(['recommend', 'topBanners']),
    }),
    shallowEqual
  )

  // other Hook
  const bannerRef = useRef()
  useEffect(() => {
    // Send network requests after component rendering
    dispatch(getTopBannersAction())
  }, [dispatch])

  const bannerChange = useCallback((from, to) => {
    setCurrentIndex(to)
  }, [])

  // Other logic: memoize
  const bgImage =
    topBanners &&
    topBanners[currentIndex] &&
    topBanners[currentIndex].imageUrl + '?imageView&blur=40x20'

  return (
    <BannerWrapper bgImage={bgImage}>
      <div className="banner w980">
        <BannerLeft>
          <Carousel
            effect="fade"
            autoplay={true}
            ref={bannerRef}
            beforeChange={bannerChange}
          >
            {topBanners && topBanners.map(item => {
              return (
                <div key={item.imageUrl}>
                  <img src={item.imageUrl} alt={item.typeTitle} />
                </div>
              )
            })}
          </Carousel>
        </BannerLeft>
        <BannerRight />
        <BannerControl>
          <button
            className="btn"
            onClick={() => bannerRef.current.prev()}
          ></button>
          <button
            className="btn"
            onClick={() => bannerRef.current.next()}
          ></button>
        </BannerControl>
      </div>
    </BannerWrapper>
  )
})
