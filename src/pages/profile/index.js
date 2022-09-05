import {
  ManOutlined,
  PlayCircleOutlined,
  WomanOutlined,
} from '@ant-design/icons'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ThemeRecommendRcm from '@/components/theme-header-rcm'
import Authentication from '../../components/Authentication'
import SongCover from '@/components/song-cover'
import {
  getUserSongList,
  setCreateUserSongList,
} from '@/service/user'
import { changeIsVisible } from '../../components/theme-login/store/actionCreator'
import { getCity, getSizeImage } from '../../utils/format-utils'
import { ProfileWrapper } from './style'
import Modal from 'antd/lib/modal/Modal'
import { Input, message } from 'antd'

export default memo(function Profile(props) {
  // props/state
  const [playlist, setPlaylist] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [playlistName, setPlaylistName] = useState('')

  // redux
  const dispatch = useDispatch()
  const { isLogin, userinfo, cookie } = useSelector((state) => ({
    isLogin: state.getIn(['loginState', 'isLogin']),
    userinfo: state.getIn(['loginState', 'profile']),
    cookie: state.getIn(['loginState', 'cookie']),
  }))

  // handle constant
  const userPic =
    userinfo && userinfo.avatarUrl && getSizeImage(userinfo.avatarUrl, 180)
  const vip = userinfo && userinfo.vipType
  const nickname = userinfo && userinfo.nickname
  const gender = userinfo && userinfo.gender === 1 ? 'man' : 'woman'
  const dynamic = [
    {
      name: 'Status',
      value: userinfo && userinfo.authStatus,
    },
    {
      name: 'Follows',
      value: userinfo && userinfo.follows,
    },
    {
      name: 'Followers',
      value: userinfo && userinfo.followeds,
    },
  ]
  const signature = userinfo && userinfo.signature
  const city = userinfo && userinfo.city && getCity(userinfo.city)
  const songlistCount = userinfo && userinfo.playlistCount
  const userId = userinfo && userinfo.userId

  // other hook
  useEffect(() => {
    getUserSongList(userId).then((res) => {
      setPlaylist(res.playlist)
    })
  }, [userId])
  // handle
  const toRedirect = useCallback(() => {
    props.history.push('/')
  }, [props.history])

  const showModal = useCallback(() => {
    dispatch(changeIsVisible(true))
  }, [dispatch])

  // modal function
  const showModalDom = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    setCreateUserSongList(playlistName, cookie).then((res) => {
      if (res.code === 200) {
        message.success('Create Sucessful😉').then(() => {
          window.location.reload()
        })
      }
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  // template
  const renderDynamicList = () => {
    return dynamic.map((item) => {
      return (
        <div className="dynamic-item" key={item.name}>
          <strong className="count">{item.value}</strong>
          <span>{item.name}</span>
        </div>
      )
    })
  }

  const renderCreatePlaylist = () => {
    return (
      <span className="creator" onClick={showModalDom}>
        Create Album
      </span>
    )
  }

  return (
    <ProfileWrapper className="content">
      {/* login authentication */}
      <Authentication flag={isLogin} to={toRedirect} showModal={showModal} />
      <div className="user-info flex">
        <div className="user-pic">
          <img src={userPic} alt="" />
        </div>
        <div className="user-detail">
          <div className="nickname-wrap">
            <h3 className="nickname gap">{nickname}</h3>
            <span className="icon-small lev">
              {vip}
              <i className="icon-small"></i>
            </span>
            <div className="gender-icon">
              {gender === 'man' ? (
                <ManOutlined className="gender-icon man" />
              ) : (
                <WomanOutlined className="gender-icon" color="#e60026" />
              )}
            </div>
          </div>
          <div className="dynamic-wrap flex">{renderDynamicList()}</div>
          <div className="recommend">Personal Introduction：{signature}</div>
          <div className="address">Location：{city}</div>
        </div>
      </div>
      <div className="song-list">
        <ThemeRecommendRcm
          title={`My album(${songlistCount})`}
          right={renderCreatePlaylist()}
          showIcon={true}
        />
        <div className="playlist flex">
          {playlist &&
            playlist.map &&
            playlist.map((item) => {
              return <SongCover info={item} key={item.id} />
            })}
        </div>
      </div>
      <Modal
        title="Create Album"
        okText="Ok"
        cancelText="Cancel"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          size="large"
          placeholder="input album"
          prefix={<PlayCircleOutlined />}
          value={playlistName}
          onInput={({ target }) => setPlaylistName(target.value)}
        />
      </Modal>
    </ProfileWrapper>
  )
})
