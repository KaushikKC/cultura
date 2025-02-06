import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import Wallet from "./components/wallet/thirdweb/Wallet";
import { ThirdwebProvider } from "thirdweb/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Wallet />,
  },
  {
    path: "/home",
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThirdwebProvider>
      <RouterProvider router={router} />
    </ThirdwebProvider>
  </React.StrictMode>
);
