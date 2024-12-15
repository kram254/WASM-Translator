import React from 'react';
import ReactDOM from 'react-dom/client'; // *jinx jinx* - Updated to use React 18's createRoot
import App from './App';
import './assets/styles.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
