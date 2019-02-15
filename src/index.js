import { InMemoryCache } from 'apollo-cache-inmemory'
import { createStore } from 'redux'
import fetch from 'node-fetch'

global.fetch = fetch

function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

let store = createStore(counter)

// store.subscribe(() => console.log(store.getState()))

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1

import { parse } from 'graphql'

import { execute } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { renderToString } from 'react-dom/server'

const express = require('express')
const graphqlHTTP = require('express-graphql')


const schema = require('./schema')
import {ApolloClient} from 'apollo-client'
import gql from 'graphql-tag'

const app = express()

app.use(express.static(__dirname))

app.use('/graphql', graphqlHTTP(() => ({
  schema,
  graphiql: true })))

app.listen(0, function() {
  const port = this.address().port
  const uri = `http://localhost:${port}/graphql`

  console.info(`Started on ${uri}`)

  const opts = {
    uri: uri,
    fetch: fetch,
  }

  const link = new HttpLink(opts)

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });

  const query = gql`query {
    test {
      id
    }
  }`

  client.query({
    query,
  }).then(res => {
    console.log({ data: res.data.test.id })
  })
})

console.log('running')
