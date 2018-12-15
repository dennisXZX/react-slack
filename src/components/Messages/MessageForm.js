import React, { Component } from 'react'
import uuidv4 from 'uuid/v4'
import FileModal from './FileModal'
import ProgressBar from './ProgressBar'
import firebase from '../../firebase'
import { Segment, Button, Input } from 'semantic-ui-react'

class MessageForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadState: '',
    uploadTask: null,
    percentUploaded: 0,
    message: '',
    loading: false,
    errors: [],
    modal: false
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

  createMessage = (fileUrl = null) => {
    const { currentUser } = this.props

    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
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

  uploadFile = (file, metadata) => {
    const pathToUpload = this.props.currentChannel.id
    const ref = this.props.messagesRef
    const filePath = `chat/public/${uuidv4()}.jpg`

    this.setState({
    	uploadState: 'uploading',
      uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
    },
      () => this._uploadFileCallback(ref, pathToUpload)
    )
  }

  render () {
    const {
      errors, message, loading,
      modal, uploadState, percentUploaded
    } = this.state

    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          value={message}
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
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />

          <Button
            onClick={this.openModal}
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
