import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import SignIn from "./SignIn.tsx";
import SignUp from "./SignUp.tsx";
import { createTheme } from "@mui/material/styles";
import RouteError from "./RouteError.tsx";
import RouteErrorSignIn from "./RouteErrorSignIn.tsx";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Owl from "./assets/Owl.png";
import Wrapper from "./Wrapper.tsx";
import Insights from "./Insights.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Wrapper />,
    children: [{ path: "/insights", element: <Insights /> }],
    errorElement: <RouteError />,
  },
  {
    path: "/signin",
    element: (
      <AppProvider
        // session={session}
        // authentication={authentication}
        branding={{
          logo: <img src={Owl} width={50} height={50} />,
          title: "Interviewer AI",
        }}
      >
        <SignIn />
      </AppProvider>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <RouteError />,
  },
  {
    path: "/error-401",
    element: <RouteErrorSignIn />,
  },
]);

const providers = [
  { id: "github", name: "GitHub" },
  { id: "google", name: "Google" },
  { id: "facebook", name: "Facebook" },
  { id: "twitter", name: "Twitter" },
  { id: "linkedin", name: "LinkedIn" },
];

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
