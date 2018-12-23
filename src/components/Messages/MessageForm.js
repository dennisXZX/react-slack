import React, { Component } from 'react'
import uuidv4 from 'uuid/v4'
import FileModal from './FileModal'
import ProgressBar from './ProgressBar'
import { Picker, emojiIndex } from 'emoji-mart'
import firebase from '../../firebase'
import { Segment, Button, Input } from 'semantic-ui-react'

import 'emoji-mart/css/emoji-mart.css'

class MessageForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    typingRef: firebase.database().ref('typing'),
    uploadState: '',
    uploadTask: null,
    percentUploaded: 0,
    message: '',
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    loading: false,
    errors: [],
    modal: false,
    emojiPicker: false
  }

  componentWillUnmount () {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel()

      this.setState({ uploadTask: null })
    }
  }

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

  handleChange = event => {
    this.setState({
    	[event.target.name]: event.target.value
    })
  }

  handleKeyDown = event => {
    // check if ctrl + enter is pressed
    if (event.ctrlKey && event.keyCode === 13) {
      this.sendMessage()
    }

    const {
      message,
      typingRef,
      channel,
      user,
    } = this.state

    if (message) {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .set(user.displayName)
    } else {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .remove()
    }
  }

  handleTogglePicker = () => {
    this.setState({
    	emojiPicker: !this.state.emojiPicker
    })
  }

  handleAddEmoji = emoji => {
    const oldMessage = this.state.message
    const newMessage = this.colonToUnicode(` ${oldMessage} ${emoji.colons} `)

    this.setState({
      message: newMessage,
      emojiPicker: false
    })

    setTimeout(() => {
      this.messageInputRef.focus()
    }, 0)
  }

  colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, '')

      let emoji = emojiIndex.emojis[x]

      if (typeof emoji !== 'undefined') {
        let unicode = emoji.native

        if (typeof unicode !== 'undefined') {
          return unicode
        }
      }

      x = ':' + x + ':'
      return x
    })
  }

  createMessage = (fileUrl = null) => {
    const { user } = this.state

    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    }

    if (fileUrl !== null) {
      message['image'] = fileUrl
    } else {
      message['content'] = this.state.message
    }

    return message
  }

  sendMessage = () => {
    const { getMessagesRef } = this.props
    const { message, channel, typingRef, user } = this.state

    if (message) {
      this.setState({ loading: true })

      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({
          	loading: false,
            message: '',
            errors: []
          })

          typingRef
            .child(channel.id)
            .child(user.uid)
            .remove()
        })
        .catch(err => {
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

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref.child(pathToUpload)
       .push()
       .set(this.createMessage(fileUrl))
       .then(() => {
         this.setState({
           uploadState: 'done'
         })
       })
       .catch(err => {
         this.setState({
           loading: false,
           errors: [...this.state.errors, err]
         })
       })
  }

  _handleUploadFile = snap => {
    const percentUploaded = Math.round(snap.bytesTransferred / snap.totalBytes) * 100

    this.setState({ percentUploaded })
  }

  _handleUploadFileError = err => {
    console.log('state_changed err', err)

    this.setState({
      errors: [...this.state.errors, err],
      uploadState: 'error',
      uploadTask: null
    })
  }

  _handleUploadFileComplete = (ref, pathToUpload) => {
    this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
      this.sendFileMessage(downloadUrl, ref, pathToUpload)
    })
      .catch(err => {
        console.log('getDownloadURL', err)

        this.setState({
          errors: [...this.state.errors, err],
          uploadState: 'error',
          uploadTask: null
        })
      })
  }

  _uploadFileCallback = (ref, pathToUpload) => {
    this.state.uploadTask.on(
      'state_changed',
      this._handleUploadFile,
      this._handleUploadFileError,
      () => this._handleUploadFileComplete(ref, pathToUpload)
    )
  }

  _getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private-${this.state.channel.id}`
    } else {
      return `chat/public`
    }
  }

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id
    const ref = this.props.getMessagesRef()
    const filePath = `${this._getPath()}/${uuidv4()}.jpg`

    this.setState({
    	uploadState: 'uploading',
      uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
    },
      () => this._uploadFileCallback(ref, pathToUpload)
    )
  }

  render () {
    const {
      errors,
      message,
      loading,
      modal,
      uploadState,
      percentUploaded,
      emojiPicker
    } = this.state

    const { messagesLoading } = this.props

    return (
      <Segment className="message__form">
        {emojiPicker && (
          <Picker
            set="apple"
            onSelect={this.handleAddEmoji}
            className="emojipicker"
            title="Pick your emoji"
            emoji="point_up"
          />
        )}
        <Input
          fluid
          name="message"
          value={message}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          style={{ marginBottom: '0.7em' }}
          ref={node => (this.messageInputRef = node)}
          disabled={messagesLoading}
          label={
            <Button
              icon={emojiPicker ? 'close' : 'add'}
              content={emojiPicker ? 'Close' : null}
              onClick={this.handleTogglePicker}
            />
          }
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
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />

          <Button
            onClick={this.openModal}
            disabled={uploadState === 'uploading'}
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />

        </Button.Group>

        <FileModal
          modal={modal}
          closeModal={this.closeModal}
          uploadFile={this.uploadFile}
        />

        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    )
  }
}

export default MessageForm
