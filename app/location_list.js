import React, { Component } from "react"
import style from "./location_list.scss"

class List extends Component {
  handleSelectStation(station) {
    const { handleFromStation, handleEndStation, stationType} = this.props
    if (stationType === 1) {
      handleFromStation(station)
    } else {
      handleEndStation(station)
    }
  }

  renderNav() { 
    const { name, data } = this.props.list
    const firstWords = name.map((item) => { return item.charAt(0)})

    const result = [...new Set(firstWords)].sort()
    return result.map((item, index) =>{
      return (
        <span key={index} className={style["right-nav-item"]}>
          {item.toUpperCase()}
        </span>
      )
    })
  }

  renderContent() {
    const { name, data } = this.props.list
    const firstWords = name.map((item) => { return item.charAt(0)})

    const result = [...new Set(firstWords)].sort()
    return result.map((item, index) =>{
      const keywords = name.filter((i) => { return i.charAt(0) === item })

      return (
        <div key={index} className={style["content-item"]}>
          <div className={style["content-title"]}>
            {item.toUpperCase()}
          </div>
          {
            keywords.slice(0,7).map((k, i) =>{
              const station = { name: data[k].name, code: data[k].code }
              return (
                <div key={i} className={style["content-desc"]} onClick={() => {this.handleSelectStation(station)} }>
                  { data[k].name }
                </div>
              )
            })
          }
          
        </div>
      )
    })
  }

  render() {
    return(
      <div className={style.main}>
        <div className={style["right-nav"]}>
          {this.renderNav()}
        </div>
        <div className={style.content}>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}

export default List