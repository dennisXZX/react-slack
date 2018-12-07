import React, { Component } from 'react'
import { Loader, Dimmer } from 'semantic-ui-react'

class Spinner extends Component {
  render () {
    return (
      <Dimmer active>
        <Loader size="huge" content={"Preparing Chat..."} />
      </Dimmer>
    )
  }
}

export default Spinner
