import React, { useState } from 'react'
import propTypes from 'prop-types'
import { getParseLoginState, getMatchReg } from '@/utils/format-utils'
import { Form, Input, Button, Checkbox, message } from 'antd'
import loginFormStyle from './style.module.css'
import { useDispatch } from 'react-redux'
import { getLoginProfileInfo } from '../theme-login/store/actionCreator'
import { sendRegisterCode, sendRegister } from '../../service/login'

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const tailLayout = {
  wrapperCol: { span: 30 },
}

/**
 * Login form component
 */
const ThemeLoginForm = (props) => {
  // prop/state
  // Get "log in"
  const { loginState } = props
  const [phone, setPhone] = useState(null)
  const [isSendSatte, setIsSendSatte] = useState(false)
  const [second, setSecond] = useState(60)
  // Resolving Login Status: phone  email  register
  const parseLoginModeText = getParseLoginState(loginState)
  // Match different rules according to different login methods
  const mathchReg = getMatchReg(loginState)
  const mathchPhoneReg = getMatchReg('phone')
  const pwdReg = /[0-9a-zA-Z._-]{6,20}/
  const codeReg = /[0-9a-zA-Z._-]{4,20}/
  // console.log(loginState, parseLoginModeText, `正则--->${mathchReg}`)
  // redux hook
  const dispatch = useDispatch()

  // other handle

  // component handle
  const onFinish = ({ username, password }) => {
    // phone
    dispatch(getLoginProfileInfo(username, password, true))
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  // Register
  const onRegisterFinish = (value) => {
    const { phone, password, code, nickname } = value
    sendRegister(code, phone, password, nickname).then((res) => {
      console.log(res)
      if (res.code === 200) message.success('Register Successful')
      else message.warn(res.message)
    })
  }
  const onRegisterFinishFailed = () => {}

  // handle function
  const handleSendCode = () => {
    // 60 second delay timer
    if (!isSendSatte) {
      let i = 0
      const timer = setInterval(() => {
        i++
        setSecond(second - i)
        if (i >= 60) {
          clearInterval(timer)
          setIsSendSatte(false)
          setSecond(60)
        }
      }, 1000)
      // send Verification Code
      !isSendSatte &&
        sendRegisterCode(phone).then((res) => {
          if (res.code === 200) message.success('Send Successful')
          else message.warn('Failed, resend verification code after 60 seconds')
        })
    }
    setIsSendSatte(true)
  }

  return (
    <>
      <Form
        style={{
          display: loginState !== 'register' ? 'block' : 'none',
        }}
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label={parseLoginModeText}
          name="username"
          rules={[
            {
              pattern: mathchReg,
              message: `Please enter the correct${parseLoginModeText}`,
            },
            { required: true, message: 'Please enter your account' },
          ]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { pattern: pwdReg, message: 'Password minimum 6 digits' },
            { required: true, message: 'Please enter your password!' },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <div className={loginFormStyle.textAlignRight}>
          <Checkbox className={loginFormStyle.mr80} defaultChecked={true}>
          Automatic Login
          </Checkbox>
          <span className={loginFormStyle.forgetPwd}>Forget Password?</span>
        </div>
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            size="middle"
            block
            shape="round"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
      <Form
        style={{
          display: loginState === 'register' ? 'block' : 'none',
        }}
        {...layout}
        name="basic"
        onFinish={onRegisterFinish}
        onFinishFailed={onRegisterFinishFailed}
      >
        <Form.Item
          label={parseLoginModeText}
          name="phone"
          rules={[
            {
              pattern: mathchPhoneReg,
              message: `Please enter the correct phone number`,
            },
            { required: true, message: 'Please enter your phone number' },
          ]}
        >
          <Input
            autoFocus
            value={phone}
            onChange={({ target }) => {
              setPhone(target.value)
            }}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ pattern: pwdReg, message: 'Password minimum 6 digits', required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <div
            className={loginFormStyle.register}
            onClick={() => handleSendCode()}
          >
            {isSendSatte ? second + 's' : 'Send verification code'}
          </div>
        </Form.Item>
        <Form.Item
          className={loginFormStyle.gap}
          label="Verification Code"
          name="code"
          rules={[{ pattern: codeReg, message: 'Verification code minimum 4 digits' }, { required: true, message: 'Please enter your verification code' }]}
        >
          <Input disabled={!isSendSatte} />
        </Form.Item>
        <Form.Item
          className={loginFormStyle.gap}
          label="Nickname"
          name="nickname"
          rules={[{ required: true, message: 'Please enter your nickname' }]}
        >
          <Input disabled={!isSendSatte} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            size="middle"
            block
            shape="round"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

ThemeLoginForm.propTypes = {
  loginState: propTypes.string,
}

ThemeLoginForm.defaultProps = {
  loginState: 'phone',
}

export default ThemeLoginForm
