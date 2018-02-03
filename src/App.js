import axios from 'axios'
import { Calendar, Badge, notification } from 'antd'
import React, { Component } from 'react'
import DiaryModal from './DiaryModal'
import './App.css'

notification.config({
  placement: 'topLeft'
})

const DIR = 'json/'
const openNotification = (msg) => {
  const args = {
    message: msg,
    description: '',
    duration: 3,
  }
  notification.open(args)
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      data: {},
      currentDiary: '',
      checkedMonth: []
    }
  }

  componentDidMount = () => {
    const d = new Date()
    const m = d.getFullYear() + '/' + (d.getMonth() + 1)
    axios.get(DIR + m + '.json')
    .then(res => {
      this.setState({
        data: {
          [m]: res.data
        },
        checkedMonth: [m]
      })
    }).catch(err => {
      openNotification('这个月没有日记')
    })
  }

  showModal = (content) => {
    this.setState({
      modalVisible: true,
      currentDiary: content
    })
  }

  closeModal = () => {
    this.setState({
      modalVisible: false
    })
  }

  getDayData = (time) => {
    var year = time.year()
    var month = time.month() + 1
    var day = time.date()
    var key = year + '/' + month
    var mData = this.state.data[key] || []
    return mData.filter(v => {
      return v.day === String(day)
    })
  }

  dateCellRender = (time) => {
    let dayData = this.getDayData(time)
    return (
      <ul className='events'>
        {
          dayData.map((item, index) => (
            <li key={index} onClick={() => this.showModal(item.content)}>
              <Badge
                status={item.type || 'warning'}
                text={item.title || 'what a boring day...'}
              />
            </li>
          ))
        }
      </ul>
    )
  }

  handleSelect = (time) => {
    var m = time.year() + '/' + (time.month() + 1)
    var ctx = this
    if (ctx.state.checkedMonth.indexOf(m) < 0) {
      axios.get(DIR + m + '.json').then(res => {
        ctx.setState({
          data: {
            ...ctx.state.data,
            [m]: res.data
          }
        })
      }).catch(err => {
        openNotification('这个月没有日记')
      })
      ctx.setState({
        checkedMonth: ctx.state.checkedMonth.concat(m)
      })
    }
  }

  render () {
    return (
      <div>
        <DiaryModal
          visible={this.state.modalVisible}
          content={this.state.currentDiary}
          closeModal={this.closeModal}
        />
        <Calendar
          dateCellRender={this.dateCellRender}
          onSelect={this.handleSelect}
          onPanelChange={this.handleSelect}
        />
      </div>
    )
  }
}

export default App
