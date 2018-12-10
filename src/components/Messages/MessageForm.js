import React, { Component } from 'react'
import firebase from '../../firebase'
import { Segment, Button, Input } from 'semantic-ui-react'

class MessageForm extends Component {
  state = {
    message: '',
    loading: false,
    errors: []
  }

  handleChange = event => {
    this.setState({
    	[event.target.name]: event.target.value
    })
  }

  createMessage = () => {
    const { currentUser } = this.props

    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      },
      content: this.state.message
    }

    return message
  }

  sendMessage = () => {
    const { messagesRef, currentChannel } = this.props
    const { message } = this.state

    if (message) {
      this.setState({ loading: true })

      messagesRef
        .child(currentChannel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({
          	loading: false,
            message: '',
            errors: []
          })
        })
        .catch(err => {
          console.log(err)

          this.setState({
          	loading: false,
            errors: [...this.state.errors, err]
          })
        })
    } else {
      this.setState({
      	errors: [...this.state.errors, { message: 'Add a message' }]
      })
    }
  }

  render () {
    const { errors } = this.state

    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          style={{ marginBottom: '0.7em' }}
          label={<Button icon={'add'} />}
          labelPosition="left"
          className={
            errors.some(error => error.message.includes('message'))
              ? 'error'
              : ''
          }
          placeholder="Write your message"
        />

        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />

          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    )
  }
}

export default MessageForm