import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'

import "./app.css"

class App extends Component {
  render () {
    const {
      currentUser,
      currentChannel,
      isPrivateChannel,
      userPosts,
      primaryColor,
      secondaryColor
    } = this.props

    return (
      <Grid columns="equal" padded style={{ background: secondaryColor, paddingTop: '20px' }} className="app">
        <ColorPanel
          key={currentUser && currentUser.name}
          currentUser={currentUser}
        />

        <SidePanel
          key={currentUser && currentUser.uid}
          currentUser={currentUser}
          primaryColor={primaryColor}
        />

        <Grid.Column style={{ marginLeft: 320 }}>
          <Messages
            key={currentChannel && currentChannel.id}
            currentChannel={currentChannel}
            currentUser={currentUser}
            isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>

        <Grid.Column width={4}>
          <MetaPanel
            key={currentChannel && currentChannel.name}
            currentChannel={currentChannel}
            isPrivateChannel={isPrivateChannel}
            userPosts={userPosts}
          />
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  primaryColor: state.colors.primaryColor,
  secondaryColor: state.colors.secondaryColor
})

export default connect(mapStateToProps)(App)
