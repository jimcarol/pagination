import React, { Component } from "react"
import Pagination from "./pagination.js"
import style from "./two_color_ball.scss"

const getShowBall = (ballNum) => {
  const len = ballNum.toString().length
  const ballShow = len > 1 ? ballNum : "0" + ballNum

  return ballShow
}

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

  render() {
    const { results, pageCount } = this.state
    return (
      <div className={style.main}>
        <div className={style.content}>
          <div className={style["center-set"]}>
            <div className={style["coshu-image"]} />
          </div>
          <div className={style.title}>
            体育彩票------双色球 (for Co叔)<br />
            祝扣叔早日中大奖
          </div>
          <div>
            <div className={ style.start } onClick={() => { this.randOut() }}>start</div>
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