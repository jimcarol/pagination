import React, { Component } from "react"
import _ from "underscore"
import style from "./location_list.scss"

class List extends Component {
  constructor() {
    super()
    this.state={ 
      searchResult: [],
      showResult: false
    }
  }

  componentDidMount() {
    console.log("=====")
    console.log(this.inputElement.value)
    this.inputElement.focus()
  }

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

  searchStation(e) {
    const { data } = this.props.list
    const inputValue = e.target.value.toLowerCase()
    let result = []
    if (inputValue) {
      const rexg = new RegExp(`^${inputValue}`)
      const stationArray = _.values(data)

      result = _.filter(stationArray, (item) => { return item.short.toLowerCase().match(rexg) || item.pinyin.toLowerCase().match(rexg) || item.name.match(rexg)})
    }
    // console.log(rexg,"...", result)
    this.setState({searchResult: result, showResult: true})
  }

  renderSearchResult() {
    const { searchResult } = this.state
    if (searchResult.length > 0) {
      return searchResult.map((item, i) =>{
        const station = { name: item.name, code: item.code }
        return (
          <div key={i} className={style["result-content-desc"]} onClick={() => {this.handleSelectStation(station)} }>
            { item.name }
          </div>
        )
      })
    }

    return (
      <div className={style["no-result"]}>
        无法查询到车站
      </div>
    )
  }

  quit() {
    const { handleQuit } = this.props
    handleQuit()
  }

  render() {
    const { showResult } = this.state
    const contentStyle = showResult ? `${style['hide']}` : `${style['show']}`
    const resultStyle = showResult ? `${style['show']}` : `${style['hide']}`
    return(
      <div className={style.main}>
        <div className={style.top}>
          <div className={style["search-container"]}>
            <span /> 
            <input type="text" placeholder="请输入城市/车站名" onKeyUp={(e) => { this.searchStation(e)}} ref={(node) => { this.inputElement = node}}/>
            <span className={style.quit} onClick={() => { this.quit() }}>取消</span>
          </div>
          <div className={`${style["searchResultContainer"]} ${resultStyle}`}>
            <div className={`${style["searchResult"]}`}>
              {this.renderSearchResult()}
            </div>
          </div>
        </div>
        <div className={`${style["right-nav"]} ${contentStyle}`}>
          {this.renderNav()}
        </div>
        <div className={`${style.content} ${contentStyle}`}>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}

export default List