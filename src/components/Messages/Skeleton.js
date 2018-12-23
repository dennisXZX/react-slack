import React, { Component } from 'react'

class Skeleton extends Component {
  render () {
    return (
      <div className="skeleton">
        <div className="skeleton__avatar"></div>
        <div className="skeleton__author"></div>
        <div className="skeleton__details"></div>
      </div>
    )
  }
}

export default Skeleton
