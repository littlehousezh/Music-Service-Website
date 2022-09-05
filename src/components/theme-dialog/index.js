import { Modal } from 'antd';
import React, { memo } from 'react';
import propTypes from 'prop-types'

function ThemeDialog(props) {
  // props/state
  const {controlShow, title, handleOk, handleCancel} = props

  return (
    <>
      <Modal
        title={title}
        visible={controlShow}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {props.children}
      </Modal>
    </>
  );
};

// Verify the passed props
ThemeDialog.propTypes = {
  controlShow: propTypes.bool.isRequired,
  title: propTypes.string
}

// Component default props
ThemeDialog.defaultProps = {
  controlShow: false,
  title: 'hello dialog'
}

export default memo(ThemeDialog)