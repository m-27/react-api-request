import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.less';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('app'));

serviceWorker.register();
