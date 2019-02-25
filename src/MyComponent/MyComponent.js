import React, { Suspense, lazy, useState, useEffect } from 'react'
import propTypes from 'prop-types'
// JSX
const MyLazyComponent = lazy(() => import('./MyLazyComponent'))

const myComponent = (props) => {
  const [hookedState, setState] = useState('Initial state.')

  useEffect(() => {
    setState('Component mounted successfully.')
  }, [])

  const [DynamicComponent, setComponent] = useState(null)

  return (
    <div>
      {props.children}
      <hr />
      <Suspense fallback={<h1>LOADING</h1>}>
        <MyLazyComponent />
      </Suspense>
      <button onClick={() => setComponent(lazy(() => import('./MyLazyComponent')))}>Fetch another lazy component!</button>
      {DynamicComponent
        ? (
          <Suspense fallback={<h1>LOADING</h1>}>
            <DynamicComponent />
          </Suspense>
        )
        : null}
      <h3>{hookedState}</h3>
    </div>
  )
}

myComponent.propTypes = {
  children: propTypes.any
}

export default myComponent
