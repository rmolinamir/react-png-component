
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
// CSS
import './sass/app.scss'
// JSX
import MyComponent from '../src'
import AnotherComp from '../dist'

class App extends Component {
  render() {
    return (
      <div className='App'>
        <AnotherComp>Another Comp!</AnotherComp>
        <h1>My Component Test!</h1>
        <MyComponent>My Component!</MyComponent>
      </div>
    )
  }
}

export default hot(module)(App)
