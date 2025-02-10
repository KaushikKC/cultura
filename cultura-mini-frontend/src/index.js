import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import Wallet from "./components/wallet/thirdweb/Wallet";
import SafeAccountSetup from "./components/wallet/safe/SafeAccountSetup";
import { ThirdwebProvider } from "thirdweb/react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GenerateMeme from "./pages/GenerateMeme";
import MemeHistory from "./pages/MemeHistory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Wallet />
  },
  {
    path: "/home",
    element: <App />
  },
  {
    path: "/safe",
    element: <SafeAccountSetup />
  },
  {
    path: "/landingpage",
    element: <LandingPage />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/meme",
    element: <GenerateMeme />
  },
  {
    path: "/history",
    element: <MemeHistory />
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThirdwebProvider>
      <RouterProvider router={router} />
    </ThirdwebProvider>
  </React.StrictMode>
);
