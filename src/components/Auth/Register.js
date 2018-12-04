import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react"
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import uniqBy from 'lodash/uniqBy'

class Register extends Component {
  state = {
    email: 'dennis@gmail.com',
    errors: [],
    loading: false,
    password: '12345',
    passwordConfirmation: '12345',
    username: 'dennis',
  }

  isFormValid = () => {
    let error

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Fill in all fields' }
      const uniqueErrors = uniqBy([...this.state.errors, error], "message")

      this.setState({ errors: uniqueErrors })

      return false
    } else if (this.isPasswordLengthInvalid(this.state)) {
      error = { message: 'Password must have at least 6 characters' }
      const uniqueErrors = uniqBy([...this.state.errors, error], "message")

      this.setState({ errors: uniqueErrors })

      return false
    } else if (this.isTwoPasswordsNotEqual(this.state)) {
      error = { message: 'The two passwords does not match' }
      const uniqueErrors = uniqBy([...this.state.errors, error], "message")

      this.setState({ errors: uniqueErrors })

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
    event.preventDefault()

    if (this.isFormValid()) {
      // reset error messages
      this.setState({
      	errors: [],
        loading: true
      })

      // create user account in firebase
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log('createdUser', createdUser)

          this.setState({
          	loading: false
          })
        })
        .catch(error => {
          const uniqueErrors =  uniqBy([...this.state.errors, error], "message")

          this.setState({
            errors: uniqueErrors,
            loading: false
          })
        })
    }
  }

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
  }

  displayErrors = (errors) => {
    return errors.map((error, i) => <p key={i}>{error.message}</p>)
  }

  render () {
    const {
      email,
      errors,
      loading,
      password,
      passwordConfirmation,
      username
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
                className={this.handleInputError(errors, 'username')}
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
                className={this.handleInputError(errors, 'email')}
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
                className={this.handleInputError(errors, 'password')}
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
                className={this.handleInputError(errors, 'password')}
                onChange={this.handleChange}/>

              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                color='orange'
                fluid
                size='large'
              >
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
