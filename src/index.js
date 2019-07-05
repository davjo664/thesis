import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import configureStore from './store/configureStore'
import initialState from './store/initialState'
import './index.css'
import '@instructure/canvas-theme'

// Note. Only the UsersPane/Tab is using a redux store. The courses tab is
// still using the old store model. That is why this might seem kind of weird.
const store = configureStore(initialState)

const props = {
  permissions: window.ENV.PERMISSIONS,
  rootAccountId: window.ENV.ROOT_ACCOUNT_ID,
  accountId: window.ENV.ACCOUNT_ID,
  roles: window.ENV.ROLES,
  store
}

// store.subscribe(() => {
  ReactDOM.render(<App {...props} />, document.getElementById('root'));
// })

