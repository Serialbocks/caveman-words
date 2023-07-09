import './App.css';
import GamesPage from './Pages/gamesPage/GamesPage';
import { BrowserRouter as Router, Route, Link, createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateGamePage from './Pages/createGamePage/CreateGamePage';
import GamePage from './Pages/gamePage/GamePage';
import { socket } from './socket';
import { useEffect, useState } from 'react';
import EnterPasswordPage from './Pages/enterPasswordPage/EnterPasswordPage';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [games, setGames] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [joiningGameName, setJoiningGameName] = useState('');

  const router = createBrowserRouter([
    {
      path: "/",
      element: <GamesPage games={games} setJoiningGameName={setJoiningGameName} />
    },
    {
      path: "/create",
      element: <CreateGamePage />
    },
    {
      path: "/game",
      element: <GamePage gameState={gameState} />
    },
    {
      path: "/enter-password",
      element: <EnterPasswordPage gameName={joiningGameName} />
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

    function onSyncGameState(gameState: any) {
      console.log(gameState);
      setGameState(gameState);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('get-games', onGetGames);
    socket.on('sync-game-state', onSyncGameState);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('get-games', onGetGames);
      socket.off('sync-game-state', onSyncGameState);
    };
  }, []);

  return (
    <div className="container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
