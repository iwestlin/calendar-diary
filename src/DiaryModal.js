import { Modal } from 'antd'
import React from 'react'
import './github-markdown.css'

const md = require('markdown-it')()

function createMarkup (markdown) {
  return {
    __html: md.render(markdown || '')
  }
}

class DiaryModal extends React.Component {
  render() {
    const props = this.props
    return (
      <Modal
        width={720}
        visible={props.visible}
        onOk={props.closeModal}
        onCancel={props.closeModal}
        footer={null}
      >
        <div className='diaryModal' dangerouslySetInnerHTML={createMarkup(props.content)} />
      </Modal>
    )
  }
}

export default DiaryModal
