import axios from 'axios'
import { BASE_URL, TIMEOUT } from './config'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({showSpinner: false});

const instance = axios.create({
  // default configuration
  baseURL: BASE_URL, // -> http://123.57.176.198:3000/banner
  timeout: TIMEOUT, // -> 5000
  headers: {},
  withCredentials: true
})

instance.interceptors.request.use(
  // Request Interception
  (config) => {
    // 1.When sending a network request, the Loading component is displayed in the middle of the interface.
    NProgress.start(); // 启动滚动条
    // 2.Some requests require the user to carry a token, if not, then the user is redirected to the login page.
    
    // 3.Operation of params/data serialization
    return config
  },
  (err) => {}
)
instance.interceptors.response.use(
  // Response Interception
  (res) => {
    NProgress.done()// close slider
    return res.data
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          console.log('Request Error')
          break
        case 401:
          console.log('Unauthorized access')
          break
        default:
          console.log('Other error messages')
      }
    }
    return err
  }
)

export default instance
