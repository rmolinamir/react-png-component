import React, { Component } from 'react'
// CSS
import classes from './App.css'
// JSX
import React_PNG_Component from 'react-png-component'

export default class App extends Component {
  render () {
    return (
      <div className='App'>
        <React_PNG_Component>React Plug-N'-Go Component!</React_PNG_Component>
      </div>
    )
  }
}
