import React, { useEffect, useState } from 'react';

const GamepadMapping: React.FC = () => {
  const [gamepadInfo, setGamepadInfo] = useState<any[]>([]);

  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      setGamepadInfo((prev) => [...prev, e.gamepad]);
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      setGamepadInfo((prev) => prev.filter(gp => gp.index !== e.gamepad.index));
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  return (
    <div>
      <h1>Gamepad Mapping</h1>
      {gamepadInfo.length === 0 ? <p>No gamepad connected</p> : (
        <ul>
          {gamepadInfo.map((gp) => (
            <li key={gp.index}>
              <h2>Gamepad {gp.index}</h2>
              <p>ID: {gp.id}</p>
              <p>Buttons: {gp.buttons.length}</p>
              <p>Axes: {gp.axes.length}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GamepadMapping;
