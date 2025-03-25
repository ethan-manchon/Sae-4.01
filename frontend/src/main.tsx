import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from './route/root.tsx';
import Register from './route/register.tsx';
import Login from './route/login.tsx';
import BackOffice from './route/backoffice.tsx';

import ProtectedRoute from './component/protectedRoute/index.tsx';

import './index.css';


const router = createBrowserRouter([
  {
    path: '/',
   
    element:( 
    <ProtectedRoute>
      <Root />
      </ProtectedRoute> 
      )
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/backoffice',
    element: <BackOffice />
  }
]);

const rootElement = document.querySelector('#root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
} else {
  console.error('No root element found');
}