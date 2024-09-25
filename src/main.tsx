import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import SignUp from "./SignUp.js";
import { createTheme } from "@mui/material/styles";
import RouteError from "./RouteError.tsx";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Owl from "./assets/Owl.png";
import Insights from "./Insights.tsx";
Amplify.configure(outputs);

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      //default: "linear-gradient(180deg, rgb(179, 176, 185), rgb(179, 176, 185)", // your gradient
    },
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: false },
});

const navArr = [
  {
    kind: "header",
    title: "Home",
  },
  {
    kind: "page",
    title: "Insights Dashboard",
    segment: "insights",
  },
  {
    kind: "header",
    title: "Interview Topics",
  },
  {
    kind: "divider",
  },
  {
    segment: "arrays",
    title: "Arrays and Strings",
    kind: "page",
  },
  {
    kind: "divider",
  },
  {
    segment: "hashing",
    title: "Hashing",
    kind: "page",
  },
  {
    kind: "divider",
  },
  {
    segment: "linked-lists",
    title: "Linked Lists",
    kind: "page",
  },
  {
    kind: "divider",
  },
  {
    segment: "stacks-and-queues",
    title: "Stacks and Queues",
    kind: "page",
  },
  {
    kind: "divider",
  },
  {
    segment: "trees-and-graphs",
    title: "Trees and Graphs",
    kind: "page",
  },
  {
    kind: "divider",
  },
  {
    segment: "heaps",
    title: "Heaps",
    kind: "page",
  },
  {
    kind: "divider",
  },
  {
    segment: "greedy-algorithms",
    title: "Greedy Algorithms",
    kind: "page",
  },
  {
    kind: "divider",
  },
  {
    segment: "binary-search",
    title: "Binary Search",
    kind: "page",
  },
  {
    kind: "divider",
  },
  {
    segment: "backtracking",
    title: "Backtracking",
    kind: "page",
  },
  {
    kind: "divider",
  },
  {
    segment: "dynamic-programming",
    title: "Dynamic Programming",
    kind: "page",
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppProvider
        branding={{
          logo: <img src={Owl} />,
          title: "Interviewer AI",
        }}
        theme={theme}
        navigation={navArr}
      >
        <DashboardLayout disableCollapsibleSidebar={true}>
          <Outlet />
        </DashboardLayout>
      </AppProvider>
    ),
    children: [{ path: "/insights", element: <Insights /> }],
    errorElement: <RouteError />,
  },
  {
    path: "/signup",
    element: (
      <AppProvider
        branding={{
          logo: <img src={Owl} width={50} height={50} />,
          title: "Interviewer AI",
        }}
        theme={theme}
        navigation={navArr}
      >
        <SignUp />
      </AppProvider>
    ),
    errorElement: <RouteError />,
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
    {/* <AppProvider
      branding={{
        logo: <img src={Owl} />,
        title: "Interviewer AI",
      }}
      theme={theme}
      navigation={navArr}
    >
       ///Element goes in here
      <DashboardLayout disableCollapsibleSidebar={true}>
      </DashboardLayout>
      </AppProvider> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
