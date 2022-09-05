import React, { memo, useEffect } from 'react'
import propTypes from 'prop-types'
import { message, Skeleton } from 'antd'

function Auth(props) {
  // props/state
  const { flag } = props

  // other hook
  useEffect(() => {
    // without login
    if (!flag) {
      //   message.warning('Please login first', {
      //     onClose() {
      //       console.log('close message')
      //     }
      //   })
      message.loading('Please login first to see the daily song list', 2).then(() => {
        // props.history.push('/')
        props.to()
        props.showModal()
      })
    }
  }, [flag, props])

  return (
    <div style={{ display: !flag ? 'block' : 'none' }}>
      <Skeleton active  />
    </div>
  )
}

Auth.propTypes = {
  flag: propTypes.bool.isRequired,
}

export default memo(Auth)
