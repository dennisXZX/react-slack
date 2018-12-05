/* React family */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'

/* utility libraries */
import firebase from "./firebase"
import registerServiceWorker from './registerServiceWorker'

import { setUser } from './actions'
import rootReducer from "./reducers"

/* React components */
import App from './components/App'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

import 'semantic-ui-css/semantic.min.css'

// create a store
const store = createStore(rootReducer, composeWithDevTools())

class Root extends Component {
  // monitor when the authentication state change,
  // if a user is successfully logged in, redirect the user to home page
  componentDidMount () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // add the user retrieved back from firebase to Redux state
        this.props.setUser(user)

        // redirect to home page
        this.props.history.push('/')
      }
    })
  }

  render () {
    return (
      <Switch>
        <Route exact path="/" component={App}/>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
      </Switch>
    )
  }
}

const RootWithAuth = withRouter(connect(null, { setUser })(Root))

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth/>
    </Router>
  </Provider>
  , document.getElementById('root'))
registerServiceWorker()
