import './App.css';
import GamesPage from './Pages/gamesPage/GamesPage';
import { BrowserRouter as Router, Route, Link, createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateGamePage from './Pages/createGamePage/CreateGamePage';
import GamePage from './Pages/gamePage/GamePage';
import { socket } from './socket';
import { useEffect, useState } from 'react';

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
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: any) {
      console.log(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <div className="container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
