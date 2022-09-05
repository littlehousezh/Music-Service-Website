import request from './request'
// get users' song list
export const getUserSongList = (userId ) => {
  return request({
    url: '/user/playlist',
    params: {
      uid: userId,
      timestamp: new Date().getTime()
    }
  })
}

// create song list
export const setCreateUserSongList = (name,cookie) => {
  return request({
    url: '/playlist/create',
    params: {
      name,
      cookie
    }
  })
}

// get user information
export const getUserInfo = (cookie) => {
  return request({
    url: '/user/subcount',
    params: {
      cookie
    }
  })
}

