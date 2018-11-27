import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react"
import { Link } from 'react-router-dom'
import firebase from '../../firebase'

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(createdUser => {
        console.log('createdUser', createdUser)
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  render () {
    const { username, email, password, passwordConfirmation } = this.state

    return (
      <Grid
        textAlign="center"
        verticalAlign="middle"
        padded>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' icon color='orange' textAlign='center'>
            <Icon name='puzzle piece' color='orange'/>
            Register for DevChat
          </Header>

          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment stacked>
              {/* username filed */}
              <Form.Input
                fluid
                type='text'
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                value={username}
                onChange={this.handleChange}/>

              {/* email field */}
              <Form.Input
                fluid
                type='text'
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email Address'
                value={email}
                onChange={this.handleChange}/>

              {/* password field */}
              <Form.Input
                fluid
                type='password'
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                value={password}
                onChange={this.handleChange}/>

              {/* password confirmation field */}
              <Form.Input
                fluid
                type='password'
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                value={passwordConfirmation}
                onChange={this.handleChange}/>

              <Button color='orange' fluid size='large'>
                Submit
              </Button>
            </Segment>
          </Form>

          <Message>Already a user? <Link to='/login'>Login</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register
