import React, { Suspense, lazy, useState, useEffect } from 'react'
import propTypes from 'prop-types'
// JSX
const MyLazyComponent = lazy(() => import(/* webpackChunkName: 'Lazy', webpackPrefetch: true */ './MyLazyComponent'))

const myComponent = (props) => {
  const [hookedState, setState] = useState('Initial state.')

  useEffect(() => {
    setState('Component mounted successfully.')
  }, [])

  return (
    <div>
      {props.children}
      <hr />
      <Suspense fallback={<h1>LOADING</h1>}>
        <MyLazyComponent />
      </Suspense>
      <h3>{hookedState}</h3>
    </div>
  )
}

myComponent.propTypes = {
  children: propTypes.any
}

export default myComponent
