import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './components/App';
import { MantineProvider } from '@mantine/core';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <App/>
  </MantineProvider>
);
