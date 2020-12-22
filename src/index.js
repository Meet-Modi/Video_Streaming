import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Fragment} from 'react';

ReactDOM.render(
  
  <React.StrictMode>
<React.Fragment> <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> </React.Fragment>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
