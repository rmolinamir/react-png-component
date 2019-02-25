import React, { useState } from 'react'
// CSS
import './App.css'
// JSX
import MyComponent from 'react-png-component'
import Tooltip from 'react-png-tooltip'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { obsidian as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const example = () => {
  const [bodyTheme, setBodyTheme] = useState('App LightTheme')

  const changeThemeHandler = () => {
    if (bodyTheme === 'App LightTheme') {
      return setBodyTheme('App DarkTheme')
    }
    return setBodyTheme('App LightTheme')
  }

  return (
    <div className={bodyTheme}>
      <div className='ThemeHandler'>
        <button className='Button' onClick={changeThemeHandler}>Change Theme</button>
      </div>
      <div className='Title'>
        <div style={{ maxWidth: '600px' }}>
          <h1>React PNG Component </h1>
        </div>
        <br />
        <div className='Description'>
          <Tooltip
            className='Tooltip'>
            <SyntaxHighlighter language='javascript' style={syntaxStyle}>{`<MyComponent />`}</SyntaxHighlighter>
          </Tooltip>
        </div>
      </div>
      <br />
      <hr />
      <MyComponent>Hello World!</MyComponent>
    </div>
  )
}

export default example
