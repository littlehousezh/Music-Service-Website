import request from './request'

// get song list
export function getSongList(limit,offset=0) {
  return request({
    url:'/top/playlist',
    params: {
      limit,
      offset
    }
  })
}

export function getSongCategory() {
  return request({
    url: "/playlist/catlist"
  })
}

export function getSongCategoryList(cat="全部", offset=0, limit = 35) {
  return request({
    url: "/top/playlist",
    params: {
      cat,
      limit,
      offset
    }
  })
}

// like
/* cid : comment id
t : if like ,1 stands for like ,0 cancel like */
export function sendLikeComment(id, cid, t, cookie) {
  return request({
    url: "/comment/like",
    params: {
      id,
      cid,
      t,
      type: 0,
      cookie
    }
  })
}

/* collect song list, pass song list id */
export function sendCollectSonglist(id, cookie) {
  return request({
    url: "/playlist/subscribe",
    params: {
      t: 1,
      id,
      cookie
    }
  })
}
