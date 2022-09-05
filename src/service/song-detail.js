import request from './request'

// Network Request for Song Details 
export function getSongDeatilData(id) {
  return request({
    url: '/playlist/detail',
    params: {
      id
    }
  })
}