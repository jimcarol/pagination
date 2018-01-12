import React, { Component } from "react"
import axios from 'axios'
import { observable, useStrict, action, runInAction, autorun } from 'mobx'
import { observer } from 'mobx-react'
import Pagination from "./pagination.js"
import style from "./two_color_ball.scss"
useStrict(true);

class Weather {
  @observable weather = {today: "", after: []}
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

const getShowBall = (ballNum) => {
  const len = ballNum.toString().length
  const ballShow = len > 1 ? ballNum : "0" + ballNum

  return ballShow
}

@observer
class TwoColorBall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      startNum: 0,
      endNum: 10,
      pageCount: 10
    }
  }

  randOut() {
    const { results } = this.state
    let redBalls = []

    while(redBalls.length < 6) {
      const redBall = Math.ceil(Math.random()*33)
      const redBallShow = getShowBall(redBall)
      if (redBalls.indexOf(redBallShow) < 0) {
        redBalls.push(redBallShow)
      }
    }
    const bullBall = Math.ceil(Math.random()*16)
    
    this.setState({results: [ ...results, { redBalls: redBalls.sort((a,b) => { return a-b} ), bullBall: getShowBall(bullBall) }] })
  }

  clear() {
    this.setState({results: []})
  }

  renderResults() {
    const { results, startNum, endNum } = this.state
    return results.slice(startNum, endNum).map((item, index) => {
      return (
        <li key={ index }>
          {
            item.redBalls.map((num, i) => {
              return <span key={ num + index + i } className={style.redNum}>{ num }</span>
            })
          }
          <span className={style.blueNum}>{item.bullBall}</span> 
        </li>
      )
    })
  }

  paging(obj) {
    const { currPage, pageCount } = obj
    const startNum = (currPage-1)*pageCount
    const endNum = currPage*pageCount

    this.setState({
      startNum,
      endNum,
      pageCount
    })
  }

  renderWeather() {
    let pages = []
    weatherState.weather.after.map((i, index) => { 
      pages.push(<div key={i.date} className={`${style["after_weather"]} ${style["after_weather_date"]}`}>{`${i.date}:`}</div>) 
      pages.push(<div key={index} className={style["after_weather"]}>{i.temp}</div>) 
    })

    return pages
  }

  render() {
    const { results, pageCount } = this.state
    return (
      <div className={style.main}>
        <div className={style.content}>
          <div className={style["center-set"]}>
            <div className={style["coshu-image"]} >
              <div className={style["weather_container"]}>
                <div className={style["weather-color"]}>今日温度: 实时->{weatherState.weather.today}</div>
                <div className={style["weather-color"]}>
                  {this.renderWeather()}
                </div>
              </div>
            </div>
          </div>
          <div className={style.title}>
            体育彩票------双色球 (for Co叔)<br />
            祝扣叔早日中大奖
          </div>
          <div>
            <div className={ style.start } onClick={() => { this.randOut()}}>start</div>
            <div className={ style.clear } onClick={() => { this.clear() }}>clear</div>
          </div>
          <div className={style["center-set"]}>
            <div className={style.text}>
              <span className={ style.redText }>红球</span>
              <span className={ style.blueText }>蓝球</span>
            </div>
          </div>
          <div>
            <ul>
              { this.renderResults() }
            </ul>
          </div>
          <div className={style.desktop}>
            { results.length > 0 &&
              <Pagination config={
                {
                  totalPage: Math.ceil(results.length/pageCount),
                  paging: (obj) => { this.paging(obj)},
                  totalCount: results.length,
                  groupCount: 7,
                  pageLimit: 10
                }
              } />
            }
          </div>
          <div className={style.mobile}>
            { results.length > 0 &&
              <Pagination config={
                {
                  totalPage: Math.ceil(results.length/pageCount),
                  paging: (obj) => { this.paging(obj)},
                  totalCount: results.length,
                  groupCount: 2,
                  pageLimit: 4
                }
              } />
            }
          </div>
        </div>
      </div>
    )
  }
}

export default TwoColorBall