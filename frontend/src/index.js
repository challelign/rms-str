// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from "react-dom";
// import { BrowserRouter } from "react-router-dom";
// import * as serviceWorker from "./serviceWorker";
// import App from "./App";

// ReactDOM.render(
//   // <BrowserRouter basename={"/rms2/login"}>

//   <BrowserRouter>
//     <App />
//   </BrowserRouter>,
//   document.getElementById("root")
// );

// serviceWorker.unregister();

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import App from "./App";

const root = document.getElementById("root");

const app = (
	<BrowserRouter>
		<App />
	</BrowserRouter>
);

ReactDOM.createRoot(root).render(app);

serviceWorker.unregister();
