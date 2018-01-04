import React, { Component } from "react"
import "./styles.scss"

export default class Pagination extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currPage: 1,
      startPage: 1,
      groupCount: this.props.config.groupCount,
      pageCount: 10
    }
  }

  go(i, reset=false) {
    const { totalPage, paging } = this.props.config
    const { groupCount } = this.state

    if (i%groupCount === 1) {
      this.setState({ startPage: i })
    }

    if (i%groupCount === 0) {
      this.setState({ startPage: i - groupCount + 1 })
    }

    if (totalPage - i < 2) {
      this.setState({ startPage: totalPage - groupCount})
    }

    this.setState({ currPage: i })

    if(reset === true){
      this.setState({
        currPage:1,
        startPage:1
      })
    }
    
    setTimeout(()=>{
      paging({
        currPage:this.state.currPage,
        pageCount:this.state.pageCount
      })
    })
  }

  goPrev() {
    let { currPage } = this.state

    if (currPage === 1) {
      return
    }

    this.go(--currPage)
  }

  goNext() {
    let { currPage } = this.state
    const { totalPage } = this.props.config

    if ( ++currPage > totalPage ) {
      return
    }

    this.go(currPage)
  }

  create() {
    const { totalPage, pageLimit } = this.props.config
    const { currPage, startPage, groupCount } = this.state
    let pages = []

    pages.push(<li key={0} onClick={() => { this.goPrev() }} className={ currPage === 1 ? "inactive" : ""} >上一页</li>)
    if (totalPage <= pageLimit) {
      for(let i=1; i<=totalPage; i++) {
        pages.push(<li key={i} onClick={() => { this.go(i) }} className={ currPage === i ? "active" : "" } >{ i }</li>)
      }
    } else {
      for(let i=startPage; i<(groupCount + startPage); i++) {
        if (i <= totalPage - 2) {
          pages.push(<li key={i} onClick={() => { this.go(i) }} className={ currPage === i ? "active" : "" } >{ i }</li>)
        }
      }

      if (totalPage - startPage >= pageLimit - 1) {
        pages.push(<li key={-1} className={"ellipsis"}>...</li>)
      }

      pages.push(<li key={totalPage - 1} onClick={() => { this.go(totalPage - 1) }} className={ currPage === (totalPage - 1) ? "active" : "" } >{ totalPage - 1 }</li>)
      pages.push(<li key={totalPage} onClick={() => { this.go(totalPage) }} className={ currPage === totalPage ? "active" : "" } >{ totalPage }</li>)
    }
    pages.push(<li key={totalPage + 1} onClick={() => { this.goNext() }} className={ currPage === totalPage ? "inactive" : "" } >下一页</li>)

    return pages
  }

  choosePageCount() {
    const pageCountUI = this.parentUI.parentNode
    pageCountUI.className = (pageCountUI.className === "hide") ? "" : "hide"
  }

  confirmPageCount(pageCount){
    const {
      currPage,
    } = this.state
    const pageCountUI = this.parentUI

    // 设置每页显示条数
    this.setState({
      pageCount
    })

    pageCountUI.innerHTML = pageCount
    pageCountUI.parentNode.className = "hide"

    setTimeout(()=>{
      this.go(currPage, true)
    },0)
  }

  render() {
    const { totalCount } = this.props.config
    return (
      <div className="main">
        <div className = "bar">
          <span>每页显示</span>
          <div className = "select">
            <ul className = "hide">
              <li id="pageCount" onClick = {() => { this.choosePageCount() }} ref={(node) => { this.parentUI = node }}>10</li>
              <li onClick = {() => { this.confirmPageCount(10) }}>10</li>
              <li onClick = {() => { this.confirmPageCount(20) }}>20</li>
              <li onClick = {() => { this.confirmPageCount(30) }}>30</li>
              <li onClick = {() => { this.confirmPageCount(50) }}>50</li>
            </ul>
          </div>
        </div>
        <ul className="page" >
          { this.create() }
        </ul>
        <span className="total-count">{`总数: ${totalCount}注`}</span>
      </div>
    )
  }
}