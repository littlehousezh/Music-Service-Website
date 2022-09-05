import request from './request'

export function getTopBanners() {
  return request({
    url: "/banner"
  })
}

// hot recommend
export function getHotRecommends(limit) {
  return request({
    url: "/personalized",
    params: {
      limit
    }
  })
}

// new albums in Home page
export function getNewAlbums() {
  return request({
    url: '/album/newest'
  })
}

// singers
export function getSettleSinger(limit) {
  return request({
    url: '/artist/list',
    params: {
      limit
    }
  })
}