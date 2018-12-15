import React, { Component } from 'react'
import moment from 'moment'
import { Comment, Image } from 'semantic-ui-react'

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? 'message__self' : ''
}

const isImage = message => {
  return message.hasOwnProperty('image') && !message.hasOwnProperty('content')
}

const timeFromNow = timestamp => moment(timestamp).fromNow()

class Message extends Component {
  render () {
    const { message, user } = this.props

    return (
      <Comment>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content className={isOwnMessage(message, user)}>
          <Comment.Author as="a">
            {message.user.name}
          </Comment.Author>

          <Comment.Metadata>
            {timeFromNow(message.timestamp)}
          </Comment.Metadata>

          {/* display a text message or an image */}
          {
            isImage(message)
              ? <Image src={message.image} className="message__image" />
              : <Comment.Text>
                  {message.content}
                </Comment.Text>
          }
        </Comment.Content>
      </Comment>
    )
  }
}

export default Message
