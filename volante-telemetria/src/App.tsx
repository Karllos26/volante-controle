import React from 'react';
import './App.css';
import GameController from './GameController';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <GameController />
      </header>
    </div>
  );
}

export default App;
