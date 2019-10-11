import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import UsersSearch from './UsersSearch';
import configureStore from './store/configureStore'
import initialState from './store/initialState'
import './index.css'
import '@instructure/canvas-theme'

const store = configureStore(initialState);
ReactDOM.render(<Provider store={store}><UsersSearch /></Provider>, document.getElementById('root'));

