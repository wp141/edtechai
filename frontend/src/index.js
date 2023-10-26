import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './components/App';
import { MantineProvider } from '@mantine/core';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-6g02p7u3ibgzyxva.au.auth0.com"
    clientId="XDRhunpk4rKcG7RATa5gpsGrmV9Qzldl"
    authorizationParams={{
      redirect_uri: "http://localhost:3000"
    }}
  >
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <App/>
    </MantineProvider>
  </Auth0Provider>
  
);
