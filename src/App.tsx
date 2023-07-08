import './App.css';
import GamesPage from './Pages/gamesPage/GamesPage';
import { BrowserRouter as Router, Route, Link, createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateGamePage from './Pages/createGamePage/CreateGamePage';
import GamePage from './Pages/gamePage/GamePage';
import { socket } from './socket';
import { useEffect, useState } from 'react';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [games, setGames] = useState([]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <GamesPage games={games} />
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

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGetGames(games: any) {
      setGames(games);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('get-games', onGetGames);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('get-games', onGetGames);
    };
  }, []);

  return (
    <div className="container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
