import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react"
import { Link } from 'react-router-dom'
import firebase from '../../firebase'

class Register extends Component {
  state = {
    username: 'dennis',
    email: 'dennis@gmail.com',
    password: '123',
    passwordConfirmation: '123',
    errors: []
  }

  isFormValid = () => {
    let errors = []
    let error

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields' }

      this.setState({ errors: [...errors, error] })

      return false
    } else if (this.isPasswordLengthInvalid(this.state)) {
      error = { message: 'Password must have at least 6 characters' }

      this.setState({ errors: [...errors, error] })

      return false
    } else if (this.isTwoPasswordsNotEqual(this.state)) {
      error = { message: 'The two passwords does not match' }

      this.setState({ errors: [...errors, error] })

      return false
    } else {
      return true
    }
  }

  // check if any field is empty
  // if the length of the field is 0, this function returns true
  // which indicates a field is empty
  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length ||
           !email.length ||
           !password.length ||
           !passwordConfirmation.length
  }

  isPasswordLengthInvalid = ({ password, passwordConfirmation }) => {
    return password.length < 6 || passwordConfirmation.length < 6
  }

  isTwoPasswordsNotEqual = ({ password, passwordConfirmation }) => {
    return password !== passwordConfirmation
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    if (this.isFormValid()) {
      event.preventDefault()

      // create user account in firebase
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
  }

  displayErrors = (errors) => {
    return errors.map((error, i) => <p key={i}>{error.message}</p>)
  }

  render () {
    const {
      email,
      errors,
      password,
      passwordConfirmation,
      username,
    } = this.state

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

          {errors.length > 0 && (
            <Message error>
              {this.displayErrors(errors)}
            </Message>
          )}

          <Message>Already a user? <Link to='/login'>Login</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Register
