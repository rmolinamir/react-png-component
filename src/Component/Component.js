import React, { Suspense, lazy, useState, useEffect } from 'react'
import propTypes from 'prop-types'
// JSX
const LazyComponent = lazy(() => import(/* webpackPrefetch: true */ './Lazy'))

const component = (props) => {
  const [hookedState, setState] = useState('Hooked State!')

  useEffect(() => {
    setState('UNITED STATES OF SMASH!')
  }, [])

  return (
    <div>
      {props.children}
      <hr />
      <Suspense fallback={<h1>LOADING</h1>}>
        <LazyComponent />
      </Suspense>
      <h3>{hookedState}</h3>
    </div>
  )
}

component.propTypes = {
  children: propTypes.any
}

export default component
