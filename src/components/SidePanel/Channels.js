import React, { Component, Fragment } from 'react'
import firebase from '../../firebase'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'

class Channels extends Component {
  state = {
    channels: [],
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    modal: false
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
        <Menu.Menu style={{ paddingBottom: '2em' }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS {' '}
            </span>
            ({ channels.length }) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>

          {/* Channels */}
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

export default Channels
