import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import firebase from '../../firebase'
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import Message from './Message'
import Typing from './Typing'
import { Segment, Comment } from 'semantic-ui-react'
import { setUserPosts } from '../../actions'
import { bindActionCreators } from 'redux'

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    privateMessageRef: firebase.database().ref('privateMessages'),
    usersRef: firebase.database().ref('users'),
    typingRef: firebase.database().ref('typing'),
    connectedRef: firebase.database().ref('.info/connected'),
    user: this.props.currentUser,
    channel: this.props.currentChannel,
    messages: [],
    messagesLoading: true,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    isChannelStarred: false,
    typingUsers: []
  }

  componentDidMount () {
    const { user, channel } = this.state

    if (channel && user) {
      this.addListeners(channel.id)
      this.addUserStarsListener(channel.id, user.uid)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.messageEnd) {
      this.scrollToBottom()
    }
  }

  scrollToBottom = () => {
    this.messageEnd.scrollIntoView({ behavior: 'smooth' })
  }

  addListeners = channelId => {
    this.addMessageListener(channelId)
    this.addTypingListeners(channelId)
  }

  addTypingListeners = channelId => {
    let typingUsers = []

    this.state.typingRef.child(channelId).on('child_added', snap => {
      if (snap.key !== this.state.user.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val()
        })

        this.setState({
        	typingUsers
        })
      }
    })

    this.state.typingRef.child(channelId).on('child_removed', snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key)

      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key)

        this.setState({
        	typingUsers
        })
      }
    })

    this.state.connectedRef.on('value', snap => {
      if (snap.val() === true) {
        this.state.typingRef
          .child(channelId)
          .child(this.state.user.uid)
          .onDisconnect()
          .remove(err => {
            if (err !== null) {
              console.log(err)
            }
          })
      }
    })
  }

  addUserStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child('starred')
      .once('value')
      .then(data => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val())
          const prevStarred = channelIds.includes(channelId)
          this.setState({ isChannelStarred: prevStarred })
        }
      })
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
      this.countUserPosts(loadedMessages)
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

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }

      return acc
    }, {})

    this.props.setUserPosts(userPosts)
  }

  displayMessages = messages => (
     messages.length > 0 && messages.map(message => (
        <Message
          key={message.timestamp}
          message={message}
          user={this.state.user}
        />
    ))
  )

  displayChannelName = channel => {
    return channel
           ? `${this.props.isPrivateChannel ? '@' : '#'}${channel.name}`
           : ''
  }

  handleStar = () => {
    this.setState(prevState => ({
      isChannelStarred: !prevState.isChannelStarred
    }), () => this.starChannel())
  }

  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .update({
          [this.state.channel.id]: {
            name: this.state.channel.name,
            details: this.state.channel.details,
            createdBy: {
              name: this.state.channel.createdBy.name,
              avatar: this.state.channel.createdBy.avatar
            }
          }
        })
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/starred`)
        .child(this.state.channel.id)
        .remove(err => {
          if (err !== null) {
            console.log(err)
          }
        })
    }
  }

  displayTypingUsers = users => (
    users.length > 0 && users.map(user => (
      <div style={{ display: 'flex', alignItems: 'center' }} key={user.id}>
        <span className="user__typing">{`${user.name} is typing`}</span> <Typing />
      </div>
    ))
  )

  render () {
    const {
      messagesRef,
      messages,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      isChannelStarred,
      user,
      channel,
      typingUsers
    } = this.state
    const { isPrivateChannel } = this.props

    return (
      <Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={isPrivateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />

        <Segment>
          <Comment.Group className="messages">
            {
              searchTerm
                ? this.displayMessages(searchResults)
                : this.displayMessages(messages)
            }
            {this.displayTypingUsers(typingUsers)}
            <div ref={node => (this.messageEnd = node)}></div>
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isPrivateChannel={isPrivateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return (
    bindActionCreators({
      setUserPosts
    }, dispatch)
  )
}

export default connect(null, mapDispatchToProps)(Messages)
