import React, { Component } from 'react'
import firebase from "../../firebase"
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react'

class UserPanel extends Component {
  dropdownOptions = () => {
    const {
      currentUser: user,
    } = this.props

    return [
      {
        key: 'user',
        text: <span>Signed in as <strong>{user && user.displayName}</strong></span>,
        disabled: true
      },
      {
        key: 'avatar',
        text: <span>Change Avatar</span>,
      },
      {
        key: 'signout',
        text: <span onClick={this.handleSignout}>Sign Out</span>
      }
    ]
  }

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('Signed out!'))
  }

  render () {
    const {
      currentUser: user,
      primaryColor
    } = this.props

    return (
      <Grid style={{ background: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2rem', margin: 0 }}>
            {/* App Header */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>

            {/* User Dropdown */}
            <Header style={{ padding: '0.25em' }} inverted as="h4">
              <Dropdown
                trigger={
                  <span>
                    <Image src={user && user.photoURL} spaced="right" avatar></Image>
                    {user && user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel
