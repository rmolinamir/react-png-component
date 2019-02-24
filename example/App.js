
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
// CSS
import './sass/app.scss'
// JSX
import NodeComp from 'react-png-component'

class App extends Component {
  render() {
    return (
      <div className='App'>
        <h1>My Component Test!</h1>
        <NodeComp>Node Comp</NodeComp>
      </div>
    )
  }
}

export default hot(module)(App)
