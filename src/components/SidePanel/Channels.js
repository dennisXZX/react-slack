import React, { Component, Fragment } from 'react'
import firebase from '../../firebase'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react'

class Channels extends Component {
  state = {
    activeChannel: '',
    channel: null,
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages'),
    notifications: [],
    modal: false,
    initialLoad: true
  }

  componentDidMount () {
    this.addListeners()
  }

  componentWillUnmount () {
    this.removeListeners()
  }

  // listen for data change at the 'channels' node
  addListeners = () => {
    let loadedChannels = []

    // callback will be triggered for the initial data and whenever the data changes
    this.state.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val())

      this.setState({ channels: loadedChannels }, () => this.setFirstChannel())
      this.addNotificationListener(snap.key)
    })
  }

  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId)
      .on('value', snap => {
        if (this.state.channel) {
          this.handleNotifications(
            channelId,
            this.state.channel.id,
            this.state.notifications,
            snap
          )
        }
      })
  }

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0

    let index = notifications.findIndex(notification => notification.id === channelId)

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal
        }
      }

      notifications[index].lastKnownTotal = snap.numChildren()
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      })
    }

    this.setState({ notifications })
  }

  removeListeners = () => {
    // remove the Firebase database listeners
    this.state.channelsRef.off()
  }

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0]

    if (this.state.initialLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel)
      this.setActiveChannel(firstChannel)
      this.setState({ channel: firstChannel })
    }

    this.setState({
    	initialLoad: false
    })
  }

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state
    const { currentUser: user } = this.props

    // generate a unique identifier for each channel
    const key = channelsRef.push().key

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user && user.displayName,
        avatar: user && user.photoURL
      }
    }

    // add the channel to Firebase database
    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({
          channelName: '',
          channelDetails: ''
        })

        this.closeModal()
      })
      .catch(err => {
        console.error(err)
      })
  }

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id })
  }

  changeChannel = channel => {
    this.setActiveChannel(channel)
    this.clearNotifications()
    this.props.setCurrentChannel(channel)
    this.props.setPrivateChannel(false)
    this.setState({ channel })
  }

  clearNotifications = () => {
    const { notifications, channel } = this.state

    let index = notifications.findIndex(notification => notification.id === channel.id)

    if (index !== -1) {
      let updatedNotifications = [...notifications]
      updatedNotifications[index].total = notifications[index].lastKnownTotal
      updatedNotifications[index].count = 0
      this.setState({ notifications: updatedNotifications })
    }
  }

  getNotificationCount = channel => {
    let count = 0

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count
      }
    })

    if (count > 0) {
      return count
    }
  }

  displayChannels = channels => (
    channels.length > 0 && channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        {this.getNotificationCount(channel) && (
          <Label color="red">
            {this.getNotificationCount(channel)}
          </Label>
        )}
        # {channel.name}
      </Menu.Item>
    ))
  )

  handleSubmit = event => {
    event.preventDefault()

    if (this.isFormValid(this.state)) {
      this.addChannel()
    }
  }

  handleChange = event => {
    this.setState({
    	[event.target.name]: event.target.value
    })
  }

  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails

  openModal = () => {
    this.setState({
    	modal: true
    })
  }

  closeModal = () => {
    this.setState({
    	modal: false
    })
  }

  render () {
    const { channels, modal } = this.state

    return (
      <Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS {' '}
            </span>
            ({ channels.length }) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>

          {/* Channels */}
          {this.displayChannels(channels)}
        </Menu.Menu>

        <Modal basic open={modal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name:"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="Details:"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark"/> Add
            </Button>

            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
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

export default connect(null, mapDispatchToProps)(Channels)
