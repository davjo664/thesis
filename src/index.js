import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import UsersPane from './components/UsersPane';
import configureStore from './store/configureStore'
import initialState from './store/initialState'
import './index.css'
import '@instructure/canvas-theme'

const store = configureStore(initialState);
ReactDOM.render(<Provider store={store}><UsersPane /></Provider>, document.getElementById('root'));

