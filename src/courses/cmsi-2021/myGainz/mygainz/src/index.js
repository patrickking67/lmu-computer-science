import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';

import Root from './pages/root';
import Home from './pages/home';
import Programs from './pages/programs';
import Progress from './pages/progress';
import Exercises from './pages/exercises';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "exercises",
        element: <Exercises />
      },
      {
        path: "programs",
        element: <Programs />
      },
      {
        path: "progress",
        element: <Progress />
      }
    ]
  }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  //  </React.StrictMode> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
