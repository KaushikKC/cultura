import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import Wallet from "./components/wallet/thirdweb/Wallet";
import SafeAccountSetup from "./components/wallet/safe/SafeAccountSetup";
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
  {
    path: "/safe",
    element: <SafeAccountSetup />,
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
