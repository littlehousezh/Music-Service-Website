import React, { memo, useRef, useState } from 'react'
import { Button, message, Modal } from 'antd'
import Draggable from 'react-draggable'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { changeIsVisible } from './store'
import { PhoneOutlined } from '@ant-design/icons'
import LoginIcon from '@/components/theme-controls-icon/login/index'
import { LoginLeft, LoginRight, LoginWrapper, PhoneLoginModal } from './style'
import ThemeLoginForm from '../theme-login-form'

/**
 * login visible box
 */
function ThemeLogin() {
  // state/props
  const [disabled, setDisabled] = useState(true)
  const [loginState, setLoginState] = useState('default') // 默认状态显示
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const draggleRef = useRef()

  // redux
  const dispatch = useDispatch()
  const { isVisible } = useSelector(
    (state) => ({
      isVisible: state.getIn(['loginState', 'isVisible']),
    }),
    shallowEqual
  )

  // cancel
  const handleCancel = (e) => {
    // cancel login visible box
    dispatch(changeIsVisible(false))
    // return to initial
    setTimeout(() => {
      setLoginState('default')
    }, 100)
  }
  // drag
  const onStart = (event, uiData) => {
    console.log('---->drag')
    const { clientWidth, clientHeight } = window?.document?.documentElement
    const targetRect = draggleRef?.current?.getBoundingClientRect()
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y),
    })
  }

  // other handle
  const handleLogin = (loginMode) => {
    switch (loginMode) {
      case 'phone':
        setLoginState('phone')
        break
      case 'email':
        setLoginState('email')
        break
      case 'register':
        setLoginState('register')
        break
      default:
    }
  }

  const defaultWrapperContent = (
    <LoginWrapper>
      <LoginLeft>
        <div className="login-content">
          <div className="login-bg"></div>
          <Button
            type="ghost"
            onClick={() => handleLogin('register')}
            shape="round"
            icon={<PhoneOutlined />}
            className="gap"
          >
            Sign Up
          </Button>
          <Button
            type="primary"
            shape="round"
            icon={<PhoneOutlined />}
            onClick={() => handleLogin('phone')}
          >
            Phone Number Login
          </Button>
        </div>
      </LoginLeft>
      <LoginRight>
        <div className="icons-wrapper">
          <LoginIcon
            onClick={() => message.warn('Please look forward to it!')}
            position="-150px -670px"
            description="WeChat Login"
          />
          <LoginIcon
            onClick={() => message.warn('Please look forward to it!')}
            position="-190px -670px"
            description="QQ Login"
          />
          <LoginIcon
            onClick={() => message.warn('Please look forward to it!')}
            position="-231px -670px"
            description="Weibo Login"
          />
          <LoginIcon
            onClick={() => handleLogin('email')}
            position="-271px -670px"
            description="Email Login"
          />
        </div>
      </LoginRight>
    </LoginWrapper>
  )

  const phoneLogin = (loginState) => {
    return (
      <PhoneLoginModal>
        <ThemeLoginForm loginState={loginState} />
      </PhoneLoginModal>
    )
  }

  return (
    <Draggable>
      <Modal
        centered
        footer={null}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false)
              }
            }}
            onMouseOut={() => {
              setDisabled(true)
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            {loginState === 'register' ? 'Sign Up' : 'Login'}
          </div>
        }
        visible={isVisible}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        {/* Login */}
        {loginState === 'default' ? defaultWrapperContent : null}
        {loginState === 'phone' ? phoneLogin() : undefined}
        {loginState === 'email' ? phoneLogin('email') : undefined}
        {loginState === 'register' ? phoneLogin('register') : undefined}
      </Modal>
    </Draggable>
  )
}

export default memo(ThemeLogin)
