//@flow

import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const App = () => {
  const [gameId, setGameId] = useLocalStorage('kkt-game-id');
  const [sensorData, setSensorData] = useState();

  useEffect(() => {
    console.log('Run once');
  }, []);

  return (
    <>
    <h1>Court Scraper Address Entry / Correction</h1>
    <div>
      Boo
    </div>
    </>
  );
};

export default App;
