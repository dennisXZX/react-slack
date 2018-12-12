import React, { Component, Fragment } from 'react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    messages: [],
    messagesLoading: true
  }

  componentDidMount () {
    const { currentChannel, currentUser } = this.props

    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id)
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId)
  }

  addMessageListener = channelId => {
    let loadedMessages = []

    this.state.messagesRef.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val())

      this.setState({
      	messages: loadedMessages,
        messagesLoading: false
      })
    })
  }

  displayMessages = messages => (
     messages.length > 0 && messages.map(message => (
        <Message
          key={message.timestamp}
          message={message}
          user={this.props.currentUser}
        />
    ))
  )

  render () {
    const { messagesRef, messages } = this.state
    const { currentChannel, currentUser } = this.props

    return (
      <Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      </Fragment>
    )
  }
}

export default Messages
