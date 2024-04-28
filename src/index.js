import * as React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import NearbyGames from './NearbyGames';
import Program from './Program';
import Standings from './Standings';
import {NextUIProvider} from "@nextui-org/system";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NextUIProvider>
    {document.location.pathname == "/nearbygames" ? <NearbyGames /> : 
    document.location.pathname == "/program" ? <Program /> : 
    document.location.pathname == "/standings" ? <Standings /> : 
    <App />}
  </NextUIProvider>
);
