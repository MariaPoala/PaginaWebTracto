import React from "react";
import ReactDOM from "react-dom/client";
import AppRouterLayout from "./AppRouterLayout.tsx";
import "./index.css";
import InteractiveFooter from './footer.tsx';
import Navbar from './head.tsx';
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Navbar></Navbar>
    {/* <AppRouterLayout /> */}
    <App/>
    <InteractiveFooter></InteractiveFooter>
  </React.StrictMode>
);
