import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.js';
import Clarity from '@microsoft/clarity'

const projectID = 'qj0yab72ei';
Clarity.init(projectID);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  // <StrictMode>
  <>
    <ColorModeScript />
    <App />
    </>
  // {/* </StrictMode> */}
);

