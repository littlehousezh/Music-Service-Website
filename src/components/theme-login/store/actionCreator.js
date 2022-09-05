import { gotoPhoneLogin } from '@/service/login'
import * as actionTypes from './actionTypes'
import loginInfo from '@/config/token'
import { getLoginInfo , setLoginInfo} from '@/utils/secret-key'
import md5 from 'js-md5'
import { message } from 'antd'
// Change the display of login
export const changeIsVisible = (visibleState) => ({
  type: actionTypes.CHANGE_IS_VISIBLE_STATE,
  isVisible: visibleState
})

// Change the Login information of Users
export const changeUserProfile = (profileInfo) => ({
  type: actionTypes.CHANGE_PROFILE_INFO,
  profile: profileInfo
})

// Change login state
export const changeUserLoginState = (loginState) => ({
  type: actionTypes.CHANGE_USER_LOGIN_STATE,
  isLogin: loginState
})

// change login token
export const changeUserLoginToken = (token) => ({
  type: actionTypes.CHANGE_PROFILE_TOKEN,
  token
})


// change login (cookie)
export const changeUserLoginCookie = (cookie) => ({
  type: actionTypes.CHANGE_PROFILE_COOKIE,
  cookie
})



// -------------get login information-------------
export const getLoginProfileInfo = (username, password, tip) => {
  return (dispatch) => {
    gotoPhoneLogin(username, undefined, md5(password)).then((res) => {
      // console.log(res)
      if (res.code !== 200) {
        message.error('Wrong account or password')
      }else {
        tip && message.success('Login successful')
        // console.log(res)
        // Login successful
        document.cookie = res.cookie
        // Save Login Information
        dispatch(changeUserProfile(res && res.profile))
        // Change login state
        dispatch(changeUserLoginState(true))
        dispatch(changeUserLoginToken(res.token))
        dispatch(changeUserLoginCookie(res.cookie))
        console.log(res)
        // 
        loginInfo.username = username
        loginInfo.password = password
        loginInfo.state = true
        let newLoginInfo = Object.assign(getLoginInfo('loginInfo'), loginInfo)
        setLoginInfo('loginInfo', newLoginInfo)
        // console.log(getLoginInfo('loginInfo'))
        // close visible box
        dispatch(changeIsVisible(false))
      }
    })
  }
}