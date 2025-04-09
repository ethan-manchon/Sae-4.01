import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./route/root.tsx";
import Register from "./route/register.tsx";
import Login from "./route/login.tsx";
import BackOffice from "./route/backoffice.tsx";
import Profil from "./route/profil.tsx";
import Feed from "./route/feed.tsx";
import Search from "./route/search.tsx";

import ProtectedRoute from "./component/protectedRoute/index.tsx";
import ProtectedRouteAdmin from "./component/protectedRouteAdmin/index.tsx";
import { PopoverProvider } from "./ui/popover/context.tsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <PopoverProvider>
          <Root />
        </PopoverProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/foryoupage",
    element: (
      <ProtectedRoute>
        <PopoverProvider>
          <Feed />
        </PopoverProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profil/:username",
    element: (
      <ProtectedRoute>
        <PopoverProvider>
          <Profil />
        </PopoverProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/search/:tag",
    element: (
      <ProtectedRoute>
        <PopoverProvider>
          <Search />
        </PopoverProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/backoffice",
    element: (
      <ProtectedRouteAdmin>
        <PopoverProvider>
          <BackOffice />
        </PopoverProvider>
      </ProtectedRouteAdmin>
    ),
  },
]);

const rootElement = document.querySelector("#root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
} else {
  console.error("No root element found");
}
