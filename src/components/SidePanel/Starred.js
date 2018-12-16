import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import { Menu, Icon } from 'semantic-ui-react'
import { bindActionCreators } from 'redux'

class Starred extends Component {
  state = {
    activeChannel: '',
    starredChannels: []
  }

  setActiveChannel = starredChannels => {
    this.setState({ activeChannel: starredChannels.id })
  }

  changeChannel = channel => {
    this.setActiveChannel(channel)
    this.props.setCurrentChannel(channel)
    this.props.setPrivateChannel(false)
  }

  displayChannels = starredChannels => (
    starredChannels.length > 0 && starredChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ))
  )  

  render () {
    const { starredChannels } = this.state

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
            <span>
              <Icon name="star" /> Starred {' '}
            </span>
          ({ starredChannels.length }) <Icon name="add" onClick={this.openModal} />
        </Menu.Item>

        {/* Channels */}
        {this.displayChannels(starredChannels)}
      </Menu.Menu>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return (
    bindActionCreators({
      setCurrentChannel,
      setPrivateChannel
    }, dispatch)
  )
}

export default connect(null, mapDispatchToProps)(Starred)
