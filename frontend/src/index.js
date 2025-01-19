import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css"
import App from './App';
import { AuthProvider } from './contexts/authContext'; // Path to your context provider
import { SocketProvider } from './contexts/SocketContext';

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            {/* <SocketProvider> */}
                <App />
            {/* </SocketProvider> */}
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
