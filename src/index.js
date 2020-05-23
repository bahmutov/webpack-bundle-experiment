import React from 'react'
import ReactDOM from 'react-dom'
import { add } from './calc'
import {get} from 'lodash'

const result = get({ name: 'Joe' }, 'name')

const App = () => (
  <>
    <div>2 + 5 = {add(2, 5)}</div>
    <div>Name is {result}</div>
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))
