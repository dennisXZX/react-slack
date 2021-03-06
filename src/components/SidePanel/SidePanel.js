import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'

import UserPanel from './UserPanel'
import Starred from './Starred'
import Channels from './Channels'
import DirectMessage from './DirectMessage'

class SidePanel extends Component {
  render () {
    const {
      currentUser,
      primaryColor
    } = this.props

    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: primaryColor, fontSize: '1.2rem' }}
      >
        <UserPanel
          currentUser={currentUser}
          primaryColor={primaryColor}
        />
        <Starred currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessage currentUser={currentUser} />
      </Menu>
    )
  }
}

export default SidePanel
