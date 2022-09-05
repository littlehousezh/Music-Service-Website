import React, { memo } from 'react'

import {
  RecommendWrapper,
  Content,
  RecommendLeft,
  RecommendRight,
} from './style'
import TopBanners from './c-cpns/top-banners'
import HotRecommend from './c-cpns/hot-recommend'
import NewAlbum from './c-cpns/new-album'
import RecommendRanking from './c-cpns/recommend-ranking'
import HotArtist from './c-cpns/hot-artist'
import UserLogin from './c-cpns/user-login'
import SettleSinger from './c-cpns/settle-singer'

function JMRecommend(props) {
  
  return (
    <RecommendWrapper>
      {/* Banners */}
      <TopBanners />
      {/* Content */}
        <Content className="w980">
          {/* Left side of the main page */}
          <RecommendLeft>
            {/* Hot Recommendation */}
            <HotRecommend history={props.history} />
            {/* New Albums */}
            <NewAlbum />
            {/* Ranking */}
            <RecommendRanking to={props.history} />
          </RecommendLeft>
          {/* Right side of the main page */}
          <RecommendRight>
            {/* Login */}
            <UserLogin />
            {/* Singer */}
            <SettleSinger />
            {/* Artist */}
            <HotArtist />
          </RecommendRight>
        </Content>
    </RecommendWrapper>
  )
}
export default memo(JMRecommend)


// dismiss following:





//#region 不再使用connect函数
// redux-immutable 解决了redux中的state不可变性的问题,因为要保证state不可变性,在每次更新state之前都会将之前state进行一次拷贝,如果数据量大的话会非常小号性能
// 使用useSelector的缺点: 因为在useSelector的缺点在组件决定当前是否渲染之前会进行一次引用对比,每次函数调用之后都会进行一次重新渲染
// 解决useSelector的缺点: 使用shallowEqual进行优化,在组件决定是否被渲染之前,会进行一次浅层对比如果该组件依赖的state并没有被更改,就不会进行渲染
//#endregion
// import React, { memo, useEffect } from 'react'
// import { connect } from 'react-redux'
// import { getTopBannersAction } from './store/actionCreator'

// function JMRecommend(props) {
//   const { getBanners, topBanners } = props
//   // 使用react-redux的connect函数,将依赖的state和dispatch传递给connect
//   useEffect(() => {
//     getBanners()
//   }, [getBanners])

//   return (
//     <div>
//       <h2>JMRecommend</h2>
//       <h3>{topBanners.length}</h3>
//     </div>
//   )
// }

// // 定义依赖的state
// const mapStateToProps = state => ({
//   topBanners: state.recommend.topBanners,
// })

// // 定义依赖的dispatch
// const mapDispatchToProps = dispatch => ({
//   getBanners() {
//     dispatch(getTopBannersAction())
//   },
// })

// export default connect(mapStateToProps, mapDispatchToProps)(memo(JMRecommend))
