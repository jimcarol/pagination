import React, { Component } from "react"
import ReactDOM from "react-dom"
import style from "./wj_styles.scss"
import weather from "./weather.json"

const WjFunny = () => {
  console.log(".....", weather)
  return (
    <div className={style.main}>
      <section className={style.content}>
        <div className={style.wj}>王静啊，留什么给你哟</div>
        <div className={style.wj}>
          <a href="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1514367480&di=e341e4a1b0fbb73da7ca434e53b1b717&src=http://img10.cntrades.com/201607/10/14-41-30-20-1124516.jpg">点我看看</a>
        </div>
        <div className={style.author}>何老师问</div>
        <div className={style.author}>{weather.today}</div>
      </section>
    </div>
  )
}

ReactDOM.render( 
  <WjFunny />,
  document.getElementById("root")
)