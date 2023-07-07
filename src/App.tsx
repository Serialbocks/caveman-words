import './App.css';
import GamesPage from './Pages/gamesPage/GamePage';
import { BrowserRouter as Router, Route, Link, createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateGamePage from './Pages/createGamePage/CreateGamePage';
import GamePage from './Pages/gamePage/GamePage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <GamesPage />
  },
  {
    path: "/create",
    element: <CreateGamePage />
  },
  {
    path: "/game",
    element: <GamePage />
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
