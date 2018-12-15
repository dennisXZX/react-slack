import React, { Component, Fragment } from 'react'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'
import { Segment, Comment } from 'semantic-ui-react'
import firebase from '../../firebase'

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    privateMessageRef: firebase.database().ref('privateMessages'),
    messages: [],
    messagesLoading: true,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: []
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
    const ref = this.getMessagesRef()

    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val())

      this.setState({
      	messages: loadedMessages,
        messagesLoading: false
      })

      this.countUniqueUsers(loadedMessages)
    })
  }

  getMessagesRef = () => {
    const { messagesRef, privateMessageRef } = this.state
    const { isPrivateChannel } = this.props

    return isPrivateChannel ? privateMessageRef : messagesRef
  }

  handleSearchChange = event => {
    this.setState({
    	searchTerm: event.target.value,
      searchLoading: true
    }, () => this.handleSearchMessages())
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages]
    const regex = new RegExp(this.state.searchTerm, 'gi')
    const searchResults = channelMessages.reduce((acc, message) => {
      if (message.content &&
         (message.content.match(regex) || message.user.name.match(regex))) {
        acc.push(message)
      }

      return acc
    }, [])

    this.setState({ searchResults })

    setTimeout(() => this.setState({ searchLoading: false }), 1000)
  }

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name)
      }

      return acc
    }, [])

    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0

    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`

    this.setState({
      numUniqueUsers
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

  displayChannelName = channel => {
    return channel
           ? `${this.props.isPrivateChannel ? '@' : '#'}${channel.name}`
           : ''
  }

  render () {
    const {
      messagesRef, messages, numUniqueUsers,
      searchTerm, searchResults, searchLoading
    } = this.state
    const { currentChannel, currentUser, isPrivateChannel } = this.props

    return (
      <Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(currentChannel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={isPrivateChannel}
        />

        <Segment>
          <Comment.Group className="messages">
            {
              searchTerm
                ? this.displayMessages(searchResults)
                : this.displayMessages(messages)
            }
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </Fragment>
    )
  }
}

export default Messages
