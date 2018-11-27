import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react"
import { Link } from 'react-router-dom'

class Register extends Component {
  handleChange = () => {
  }

  render () {
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

          <Form size='large'>
            <Segment stacked>
              {/* username filed */}
              <Form.Input
                fluid
                type='text'
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                onChange={this.handleChange}/>

              {/* email field */}
              <Form.Input
                fluid
                type='text'
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email Address'
                onChange={this.handleChange}/>

              {/* password field */}
              <Form.Input
                fluid
                type='password'
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                onChange={this.handleChange}/>

              {/* password confirmation field */}
              <Form.Input
                fluid
                type='password'
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
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
