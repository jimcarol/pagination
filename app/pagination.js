import React, { Component } from "react"
import "./styles.scss"

export default class Pagination extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currPage: 1,
      startPage: 1,
      groupCount: 7
    }
  }

  go(i) {
    const { totalPage } = this.props.config
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
    const { totalPage } = this.props.config
    const { currPage, startPage, groupCount } = this.state
    let pages = []

    pages.push(<li key={0} onClick={() => { this.goPrev() }} className={ currPage === 1 ? "inactive" : ""} >上一页</li>)
    if (totalPage <= 10) {
      for(let i=1; i<=totalPage; i++) {
        pages.push(<li key={i} onClick={() => { this.go(i) }} className={ currPage === i ? "active" : "" } >{ i }</li>)
      }
    } else {
      for(let i=startPage; i<(groupCount + startPage); i++) {
        if (i <= totalPage - 2) {
          pages.push(<li key={i} onClick={() => { this.go(i) }} className={ currPage === i ? "active" : "" } >{ i }</li>)
        }
      }

      if (totalPage - startPage >= 9) {
        pages.push(<li key={-1} className={"ellipsis"}>...</li>)
      }

      pages.push(<li key={totalPage - 1} onClick={() => { this.go(totalPage - 1) }} className={ currPage === (totalPage - 1) ? "active" : "" } >{ totalPage - 1 }</li>)
      pages.push(<li key={totalPage} onClick={() => { this.go(totalPage) }} className={ currPage === totalPage ? "active" : "" } >{ totalPage }</li>)
    }
    pages.push(<li key={totalPage + 1} onClick={() => { this.goNext() }} className={ currPage === totalPage ? "inactive" : "" } >下一页</li>)

    return pages
  }

  render() {
    return (
      <div className="main">
        <ul className="page" >
          { this.create() }
        </ul>
      </div>
    )
  }
}