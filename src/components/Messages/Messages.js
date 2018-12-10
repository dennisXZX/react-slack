import React, { Component, Fragment } from 'react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import { Segment, Comment } from 'semantic-ui-react'

class Messages extends Component {
  render () {
    return (
      <Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">
            {/* Messages */}
          </Comment.Group>
        </Segment>

        <MessageForm />
      </Fragment>
    )
  }
}

export default Messages
