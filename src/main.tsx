import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./HomePage.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./SignUp.js";
import { createTheme } from "@mui/material/styles";
import RouteError from "./RouteError.tsx";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";

Amplify.configure(outputs);

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const navArr = [
  {
    kind: "header",
    title: "Interview Topics",
  },
  {
    segment: "page",
    title: "Arrays and Strings",
  },
  {
    segment: "page-2",
    title: "Hashing",
  },
  {
    segment: "",
    title: "Linked Lists",
  },
  {
    segment: "",
    title: "Stacks and Queues",
  },
  {
    segment: "",
    title: "Trees and Graphs",
  },
  {
    segment: "",
    title: "Heaps",
  },
  {
    segment: "",
    title: "Greedy Algorithms",
  },
  {
    segment: "",
    title: "Binary Search",
  },
  {
    segment: "",
    title: "Backtracking",
  },
  {
    segment: "",
    title: "Dynamic Programming",
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteError />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/error",
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider theme={theme} navigation={navArr}>
      <DashboardLayout style>
        <RouterProvider router={router} />
      </DashboardLayout>
    </AppProvider>
  </React.StrictMode>
);
