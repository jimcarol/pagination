import React, { Component } from "react"
import Pagination from "./pagination.js"
import style from "./two_color_ball.scss"

class TwoColorBall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: []
    }
  }

  randOut() {
    const { results } = this.state
    let redBalls = []

    while(redBalls.length < 6) {
      const redBall = Math.ceil(Math.random()*35);
      if (redBalls.indexOf(redBall) < 0) {
        redBalls.push(redBall)
      }
    }
    const bullBall = Math.ceil(Math.random()*16)
    
    this.setState({results: [ ...results, { redBalls: redBalls.sort((a,b) => { return a-b} ), bullBall: bullBall }] })
  }

  clear() {
    this.setState({results: []})
  }

  renderResults() {
    const { results } = this.state
    return results.map((item, index) => {
      return (
        <li key={ index }>
          {
            item.redBalls.map((num) => {
              return <span key={ num } className={style.redNum}>{ num }</span>
            })
          }
          <span className={style.blueNum}>{`- ${ item.bullBall }`}</span> 
        </li>
      )
    })
  }

  render() {
    return (
      <div className={style.main}>
        <div className={style.content}>
          <div className={style.title}>
            体育彩票------双色球 (for Co叔)
          </div>
          <div>
            <div className={ style.start } onClick={() => { this.randOut() }}>start</div>
            <div className={ style.clear } onClick={() => { this.clear() }}>clear</div>
          </div>
          <div className={style.text}>
            <span className={ style.redText }>红球</span>
            <span className={ style.blueText }>篮球</span>
          </div>
          <div>
            <ul>
              { this.renderResults() }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default TwoColorBall