import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react"
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import uniqBy from 'lodash/uniqBy'

class Login extends Component {
  state = {
    email: 'dennis@gmail.com',
    errors: [],
    loading: false,
    password: '123456',
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    if (this.isFormValid(this.state)) {
      // reset error messages
      this.setState({
        errors: [],
        loading: true
      })

      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(signedInUser => {
          console.log(signedInUser)

          this.setState({
          	loading: false
          })
        })
        .catch(this.handlePromiseError)
    }
  }

  isFormValid = ({ email, password }) => email && password

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
  }

  handlePromiseError = error => {
    const uniqueErrors = uniqBy([...this.state.errors, error], "message")

    this.setState({
      errors: uniqueErrors,
      loading: false
    })
  }

  displayErrors = (errors) => {
    return errors.map((error, i) => <p key={i}>{error.message}</p>)
  }

  render () {
    const {
      email,
      errors,
      loading,
      password
    } = this.state

    return (
      <Grid
        textAlign="center"
        verticalAlign="middle"
        padded>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' icon color='orange' textAlign='center'>
            <Icon name='code branch' color='orange'/>
            Login to DevChat
          </Header>

          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment stacked>
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

          <Message>Don't have an account? <Link to='/register'>Register</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login
