import * as React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {NextUIProvider} from "@nextui-org/system";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NextUIProvider>
    <App />
  </NextUIProvider>
);
