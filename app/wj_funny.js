import React, { Component } from "react"
import ReactDOM from "react-dom"
import axios from 'axios'
import { observable, useStrict, action, runInAction, autorun } from 'mobx'
import { observer } from 'mobx-react'
import style from "./wj_styles.scss"
useStrict(true);

class Weather {
  @observable weather = {today: {}, after: []}
  @action initData = async () => {
    let weather_data
    await axios.get("http://116.196.113.206/api/weather", { method: 'GET', dataType: 'JSONP'})
    .then((result) => {
        console.log("/......",result)
        weather_data = result.data
    })
    runInAction(() => {
      this.weather = weather_data
    });
  }
  // @action initData = () => {
  //   this.weather = 2
  // }

  constructor() {
    autorun(() => this.initData());
  }
}

const weatherState = new Weather();

@observer
class WjFunny extends Component {
  renderWeather() {
    let pages = []
    pages.push(<div key={-1} className={`${style["after_weather"]} ${style["after_weather_date"]}`}>Tips:</div>)
    weatherState.weather.after.map((i, index) => { 
      pages.push(<div key={index} className={style["after_weather"]}>{i.date}{i.temp} {`${index == 0 ? '~' : ''}`}</div>)
    })

    return pages
  }

  render() {
    const { rcomfort } = weatherState.weather.today
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
      </div>
    )
  }
}

ReactDOM.render( 
  <WjFunny />,
  document.getElementById("root")
)