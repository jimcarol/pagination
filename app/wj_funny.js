import React, { Component } from "react"
import ReactDOM from "react-dom"
import axios from 'axios'
import moment from 'moment'
import DatePicker from 'react-mobile-datepicker'
import { observable, useStrict, action, runInAction, autorun } from 'mobx'
import { observer } from 'mobx-react'
import List from "./location_list.js"
import style from "./wj_styles.scss"
useStrict(true);

class Weather {
  @observable weather = {today: {}, after: []}
  @observable train_location = {data: {}, name: []}
  @action initData = async () => {
    let weather_data, train_location
    await axios.get("http://39.108.10.190/api/weather", { method: 'GET', dataType: 'JSONP'})
    .then((result) => {
        weather_data = result.data
    })
    runInAction(() => {
      this.weather = weather_data
    });

    await axios.get("http://39.108.10.190/api/weather/train_location", { method: 'GET', dataType: 'JSONP'})
    .then((result) => {
        train_location = result.data
    })
    runInAction(() => {
      this.train_location = train_location
    });
  }
  // @action initData = () => {
  //   this.weather = 2
  // }

  constructor() {
    autorun(() => this.initData());
  }
}

class Ticket {
  @observable tickets = ""
  @observable submitElement =true

  @action setDisabled = () => {
    this.submitElement = false
  }

  @action resetTickets = () => {
    this.tickets = ""
  }

  @action getTickets = async (params) => {
    let data = [] 
    await axios.get("http://116.196.113.206/api/weather/train_ticket", { 
      method: 'GET', dataType: 'JSONP',
      params: params,
    })
    .then((result) => {
      if (result.data.status == 200) {
        data = result.data.data
      } else {
        data = "error"
      }
    })

    runInAction(() => {
      this.tickets = data
      this.submitElement = true
    });
  }
}

const weatherState = new Weather();
const ticketState = new Ticket();

@observer
class WjFunny extends Component {
  constructor(props) {
    super(props)
    this.state={
      time: new Date(),
      isOpen: false,
      showList: false,
      fromStation: {fromStation: "广州", fromCode: "GZQ"},
      endStation: {endStation: "樟树", endCode: "ZSG"},
      stationType: 1
    }
  }

  handleCancel() {
    this.setState({isOpen: false})
  }

  handleSelect(time) {
    this.setState({time: time, isOpen: false})
  }

  handleOpen() {
    this.setState({isOpen: true})
  }

  handleShowList(flag) {
    this.setState({stationType: flag, showList: true})
  }

  handleFromStation(station) {
    this.setState({fromStation: {fromStation: station.name, fromCode: station.code}, showList: false})
  }

  handleQuit() {
    this.setState({showList: false})
  }

  handleEndStation(station) {
    this.setState({endStation: {endStation: station.name, endCode: station.code}, showList: false})
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit() {
    const { fromCode } = this.state.fromStation
    const { endCode } = this.state.endStation
    ticketState.setDisabled()
    ticketState.getTickets({date: moment(this.state.time).format("YYYY-MM-DD"), from_station: fromCode, end_station: endCode })
  }

  renderSubmit() {
    if (ticketState.submitElement) {
      return(
        <div className={style.submit} onClick={() => { this.handleSubmit() }}>查询</div>
      )
    }

    return(
      <div className={style.disabled}>查询</div>
    )
  }

  renderWeather() {
    let pages = []
    pages.push(<div key={-1} className={`${style["after_weather"]} ${style["after_weather_date"]}`}>Tips:</div>)
    weatherState.weather.after.map((i, index) => { 
      pages.push(<div key={index} className={style["after_weather"]}>{i.date}{i.temp} {`${index == 0 ? '~' : ''}`}</div>)
    })

    return pages
  }

  renderTicketNum(item) {
    if (item.tId.charAt(0) === "G" || item.tId.charAt(0) === "D") {
      return(
        <div className={style["station-ticket-num"]}>
          <span className={`${(item.bcSeat&&item.bcSeat != "无") ? style["delp_black"] : ''}`}>商务:{item.bcSeat}</span>
          <span className={`${item.fcSeat != "无" ? style["delp_black"] : ''}`}>一等:{item.fcSeat}</span>
          <span className={`${item.scSeat != "无" ? style["delp_black"] : ''}`}>二等:{item.scSeat}</span>
        </div>
      )
    }

    return(
      <div className={style["station-ticket-num"]}>
        <span className={`${(item.ruanwo&&item.ruanwo != "无") ? style["delp_black"] : ''}`}>软卧:{item.ruanwo}</span>
        <span className={`${(item.yingwo&&item.yingwo != "无") ? style["delp_black"] : ''}`}>硬卧:{item.yingwo}</span>
        <span className={`${item.yingzuo != "无" ? style["delp_black"] : ''}`}>硬座:{item.yingzuo}</span>
        <span className={`${item.wuzuo != "无" ? style["delp_black"] : ''}`}>无座:{item.wuzuo}</span>
      </div>
    )
  }

  renderTickets() {
    if (!ticketState.tickets) return false

    if (ticketState.tickets == "error") {
      return (
        <div className={style["tickets-container"]}>
          <span className={style.errorMessage}>mmp！！网速不佳，请求12306超时</span>
          <span className={style.errorMessage}>请重试吧，我也莫得法子</span>
        </div>
      )
    }

    if(ticketState.tickets.length == 0) {
      const { fromStation, fromCode } = this.state.fromStation
      const { endStation, endCode } = this.state.endStation
      return (
        <div className={style["tickets-container"]}>
          <span className={style.errorMessage}><span className={style.errorMessage}>未找到{fromStation}</span>开往<span className={style.errorMessage}>{endStation}</span>的列车</span>
        </div>
      )
    }

    return ticketState.tickets.map((item, i) =>{
      const isStartText = item.from_station_no === "01" ? "始" : "过"
      const isStartStyle = item.from_station_no === "01" ? `${style.shi}` : `${style.guo}`
      const timeArr = item.tTime.split(":")

      return ( 
        <div key={i} className={style["tickets-container"]} >
          <div className={style["station-message"]}>
            <div className={style.No}>{item.tId}</div>
            <div className={style.start}>
              <div>
                <span className={isStartStyle}>{isStartText}</span>
                {item.fSation}<br />
                <span className={style.stime}>{item.sTime}</span>
              </div>
            </div>
            <div className={style.range}>
              <div className={style.leargeArrow} ><img src="../asset/arrow-large-right.png" /></div>
              <div className={style.timeArr}>共{timeArr[0]}小时{timeArr[1]}分钟</div>
            </div>
            <div className={style.end}>
              <div>
                <span className={style.guo}>过</span>
                {item.tSation}
              </div>
              <div className={style.eTime}>
                {item.eTime}
              </div>
            </div>
          </div>
          {this.renderTicketNum(item)}
        </div>
      )
    })
  }

  render() {
    const { rcomfort } = weatherState.weather.today
    const { fromStation, fromCode } = this.state.fromStation
    const { endStation, endCode } = this.state.endStation
    let comforDesc = ""
    if (rcomfort) {
      comforDesc = "不是很舒服"
      if (rcomfort < 60 && rcomfort > 45) {
        comforDesc = "一般般，可以接受"
      }
      if (rcomfort >= 60) {
        comforDesc = "舒服，非常好的天气"
      }
    }

    return(
      <div className={style.main}>
        <section className={style.content}>
          <div className={style.wj}>群里的同志们要注意身体啊</div>
          <div className={style.wj}>
            <a href="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1514367480&di=e341e4a1b0fbb73da7ca434e53b1b717&src=http://img10.cntrades.com/201607/10/14-41-30-20-1124516.jpg">点我看看</a>
          </div>
          <div className={style["weather_container"]}>
            <div className={style["weather-color"]}>实时温度: {weatherState.weather.today.temperature}℃ {weatherState.weather.today.info}</div>
            <div className={style["weather-color"]}>实时体感温度: {weatherState.weather.today.feelst}℃</div>
            <div className={style["weather-color"]}>实时舒适度: {comforDesc}</div>
            <div className={style["weather-color"]}>
              {this.renderWeather()}
            </div>
          </div>
        </section>
        <section className={style.train}>
          <div className={style["from_to"]}>
            <input type="text" className={style["location-input"]} value={fromStation} readOnly="readOnly" onChange={(e) => {this.handleChange(e)}} onClick={() => {this.handleShowList(1)}} />
            <span className={style.arrow} />
            <input type="text" className={style["location-input"]} value={endStation} readOnly="readOnly" onChange={(e) => {this.handleChange(e)}} onClick={() => {this.handleShowList(2)}} />
          </div>
          <div className={style["out-date"]} onClick={() => {this.handleOpen()}}>
            <span className={style["date-text"]}>出发日期</span>
            <span className={style.date}>{moment(this.state.time).format("YYYY-MM-DD")}</span>
          </div>
          <div>
            <DatePicker
              value={this.state.time}
              isOpen={this.state.isOpen}
              onSelect={(time) => this.handleSelect(time)}
              min={new Date()}
              max={new Date(moment().add(28, 'days'))}
              onCancel={() => this.handleCancel()} />
          </div>
          { this.renderSubmit() }
        </section>
        <div className={`${style.list} ${this.state.showList ? style.show : style.hide}`}>
          { this.state.showList && <List list={weatherState.train_location}
            stationType={this.state.stationType} 
            handleFromStation={(station) => this.handleFromStation(station)}
            handleEndStation={(station) => this.handleEndStation(station)}
            handleQuit={() => this.handleQuit()}
            />
          }
        </div>
        <div className={style.tickets}>
        <div className={style.stationTitle}><span className={style.errorMessage}>{fromStation}</span>开往<span className={style.errorMessage}>{endStation}</span>的所有列车</div>
          {this.renderTickets()}
        </div>
      </div>
    )
  }
}

ReactDOM.render( 
  <WjFunny />,
  document.getElementById("root")
)