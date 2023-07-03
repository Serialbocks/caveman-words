import logo from './logo.svg';
import './App.css';
import GamesPage from './Pages/gamesPage/GamePage';
import React from "react";
import { BrowserRouter as Router, Route, Link, createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateGamePage from './Pages/createGamePage/CreateGamePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <GamesPage />
  },
  {
    path: "/create",
    element: <CreateGamePage />
  }
]);

function App() {
  return (
    <div className="container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
