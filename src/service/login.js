import request from './request'
/* phone login */
export function gotoPhoneLogin(phone, password, md5_password, countrycode) {
  return request({
    url: '/login/cellphone',
    method: 'get',
    params: {
      phone,
      password,
      countrycode,
      md5_password,
    },
  })
}

/* email login */
export function gotoEmailLogin(email, password, md5_password) {
  return request({
    url: '/login',
    method: 'get',
    params: {
      email,
      password,
      md5_password,
    },
  })
}

// send verification code
export function sendRegisterCode(phone) {
  return request({
    url: '/captcha/sent',
    method: 'get',
    params: {
      phone,
    },
  })
}

/* register */
export function sendRegister(captcha, phone, password, nickname) {
  return request({
    url: '/register/cellphone',
    method: 'get',
    params: {
      captcha,
      phone,
      password,
      nickname,
    },
  })
}
