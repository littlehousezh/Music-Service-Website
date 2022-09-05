import React, {
  memo,
  useEffect,
  useState,
  createElement,
  useCallback,
} from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Comment, Tooltip, Avatar, message } from 'antd'
import { LikeFilled, LikeOutlined } from '@ant-design/icons'
// import { Pagination } from 'antd'
import HYPagination from '@/components/pagination/index'
import ThemeHeader from '@/components/theme-header'
import { SoNewWrapper, SongCommentWrapper, WonderfulWrapper } from './style'
import { changeCurrentCommentTotal, getHotCommentAction } from '../../store/actionCreator'
import { changeIsVisible } from '@/components/theme-login/store/index'
import { sendSongComment } from '@/service/player'
import { getCount } from '../../../../utils/format-utils'
import { getSongComment } from '@/service/player'
import ThemeComment from '../../../../components/theme-comment'
import { sendLikeComment } from '../../../../service/songs'

function SongComment() {
  // props/state
  const [songComment, setSongComment] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [flag, setFlag] = useState(false)
  const [liked, setLiked] = useState([]) // like status
  // const [total, setTotal] = useState(0)

  // redux hook
  const dispatch = useDispatch()
  const {
    hotComments,
    currentSongId,
    isLogin,
    cookie,
    avatarUrl,
  } = useSelector(
    (state) => ({
      hotComments: state.getIn(['player', 'hotComments']),
      currentSongId: state.getIn(['player', 'currentSong', 'id']),
      isLogin: state.getIn(['loginState', 'isLogin']),
      cookie: state.getIn(['loginState', 'cookie']),
      avatarUrl: state.getIn(['loginState', 'profile', 'avatarUrl']),
    }),
    shallowEqual
  )

  // other hooks
  useEffect(() => {
    dispatch(getHotCommentAction(currentSongId))
    getSongComment(currentSongId).then((res) => {
      setSongComment(res.comments)
      // console.log(res)
      setTotal(res.total)
      dispatch(changeCurrentCommentTotal(res.total))
      // likedArr.push(res)
      // setTotal(res.total)
    })
  }, [dispatch, currentSongId])

  // other handle
  function formatDate(time = +new Date()) {
    var date = new Date(time + 8 * 3600 * 1000) // add 8 hours
    return date.toJSON().substr(0, 19).replace('T', ' ')
  }
  // like and comments
  const likeComment = (index, data) => {
    // if (liked[index].count >= 1) return
    // Login Authentication
    if(!isLogin) { // No login
      dispatch(changeIsVisible(true))
    }
    if (!flag) {
      liked[index].liked = true
      liked[index].count += 1
      setLiked(liked)
      /* Tune the interface */
      // console.log(data)
      sendLikeComment(currentSongId,data.commentId,1, cookie).then((res) => {
        console.log('res :>>>', res)

        if(res.code === 200) message.success('Like Sucessful')
        else message.success('Please try again later')
      })
    } else {
      liked[index].liked = false
      liked[index].count -= 1
      setLiked(liked)
      setFlag(true)
      // console.log('disliked')
      /* cancel like interface */
      sendLikeComment(data.commentId,0, cookie).then((res) => {
        if(res.code === 200) message.success('Cancel Like Sucessful')
        else message.success('Please try again later')
      })
    }
    setFlag(!flag)
  }

  // another page
  const changePage = useCallback(
    (currentPage) => {
      setCurrentPage(currentPage)
      
      const targePageCount = (currentPage - 1) * 20
      getSongComment(currentSongId, 20, targePageCount).then((res) => {
        setSongComment(res.comments)
        setTotal(res.total)
      })
    },
    [currentSongId]
  )

  // template html action
  // like HTML
  const getLikeTemplateAction = (item, index) => {
    liked.push({
      liked: item.liked,
      count: item.likedCount,
    })
    // console.log('item, index :>>>', item, index)
    return [
      <Tooltip key="comment-basic-like" title="Like" className="comment-like">
        <span onClick={() => likeComment(index, item)}>
          {createElement(
            liked[index].liked === true ? LikeFilled : LikeOutlined
          )}
          <span className="comment-action">{getCount(liked[index].count)}</span>
        </span>
      </Tooltip>,
    ]
  }
  // Review song checks (get focus)
  const commentSongcheckout = () => {
    // no login
    if (!isLogin) dispatch(changeIsVisible(true))
  }

  // comment successful
  const commentCallbackOk = (value) => {
    sendSongComment(currentSongId, value, cookie).then((res) => {
      if(res.code === 200) message.success('Comment Successful').then(() => {
        getSongComment(currentSongId).then((res) => {
          setSongComment(res.comments)
          setTotal(res.total)
        })
      })
    })
  }

  return (
    <SongCommentWrapper>
      <ThemeHeader title="comment" />
      {/* comment content */}
      <ThemeComment
        onFocus={() => commentSongcheckout()}
        callbackOk={(value) => commentCallbackOk(value)}
        isLogin={isLogin}
        photo={avatarUrl}
      />
      {/* Highlights */}
      <WonderfulWrapper>
        <div className="header-comment">Highlights</div>
        {hotComments &&
          hotComments.map((item, index) => {
            return (
              <Comment
                // actions={getLikeTemplateAction(item, index)}
                key={item.commentId}
                author={item.user.nickname}
                avatar={<Avatar src={item.user.avatarUrl} alt="Han Solo" />}
                content={<p>{item.content}</p>}
                datetime={
                  <Tooltip title={formatDate(item.time)}>
                    {formatDate(item.time).slice(
                      0,
                      formatDate(item.time).indexOf(' ')
                    )}
                  </Tooltip>
                }
              />
            )
          })}
      </WonderfulWrapper>
      {/* Recent comment */}
      <SoNewWrapper>
        <div className="header-comment">Latest Comments</div>
        {songComment &&
          songComment.map((item, index) => {
            return (
              <Comment
                actions={getLikeTemplateAction(item, index)}
                key={item.commentId}
                author={item.user.nickname}
                avatar={<Avatar src={item.user.avatarUrl} alt="Han Solo" />}
                content={<p>{item.content}</p>}
                datetime={
                  <Tooltip title={formatDate(item.time)}>
                    {formatDate(item.time).slice(0, formatDate(item.time))}
                  </Tooltip>
                }
              />
            )
          })}
      </SoNewWrapper>
      {/* net page */}
      <HYPagination
        currentPage={currentPage}
        pageSize={20}
        total={total}
        onPageChange={(currentPage) => changePage(currentPage)}
      />
    </SongCommentWrapper>
  )
}

export default memo(SongComment)
