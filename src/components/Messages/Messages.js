import React, { Component, Fragment } from 'react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages')
  }

  render () {
    const { messagesRef } = this.state
    const { currentChannel, currentUser } = this.props

    return (
      <Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">
            {/* Messages */}
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
