import React, { useState, useEffect, useCallback } from 'react';
import './GameController.css';

interface GamepadBinding {
  eixoX: number | null;
  acelerador: number | null;
  freio: number | null;
  marchaUp: number | null;
  marchaDown: number | null;
}

const GameController: React.FC = () => {
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);
  const [selectedGamepadIndex, setSelectedGamepadIndex] = useState<number | null>(null);
  const [binding, setBinding] = useState<GamepadBinding>({
    eixoX: null,
    acelerador: null,
    freio: null,
    marchaUp: null,
    marchaDown: null,
  });

  const [state, setState] = useState({
    grausVolante: 0,
    acelerador: 0,
    freio: 0,
    marcha: 0,
  });

  useEffect(() => {
    const updateGamepads = () => {
      setGamepads(
        Array.from(navigator.getGamepads()).filter(Boolean) as Gamepad[]
      );
    };
    window.addEventListener('gamepadconnected', updateGamepads);
    window.addEventListener('gamepaddisconnected', updateGamepads);
    updateGamepads();
    return () => {
      window.removeEventListener('gamepadconnected', updateGamepads);
      window.removeEventListener('gamepaddisconnected', updateGamepads);
    };
  }, []);

  const handleGamepadInput = useCallback(() => {
    if (selectedGamepadIndex === null) return;
    const gp = gamepads[selectedGamepadIndex];
    if (!gp) return;

    const eixoXValue = binding.eixoX !== null ? gp.axes[binding.eixoX] : 0;
    const aceleradorValue = binding.acelerador !== null ? gp.buttons[binding.acelerador]?.value : 0;
    const freioValue = binding.freio !== null ? gp.buttons[binding.freio]?.value : 0;

    const grausVolante = Math.min(Math.max(eixoXValue * 900, -450), 450);
    const marcha = state.marcha + 
      (binding.marchaUp !== null && gp.buttons[binding.marchaUp]?.pressed ? 1 : 0) -
      (binding.marchaDown !== null && gp.buttons[binding.marchaDown]?.pressed ? 1 : 0);

    setState({ grausVolante, acelerador: aceleradorValue, freio: freioValue, marcha });

    requestAnimationFrame(handleGamepadInput);
  }, [binding, gamepads, selectedGamepadIndex, state.marcha]);

  useEffect(() => {
    if (selectedGamepadIndex !== null) {
      requestAnimationFrame(handleGamepadInput);
    }
  }, [selectedGamepadIndex, handleGamepadInput]);

  const startBinding = (target: keyof GamepadBinding) => {
    if (selectedGamepadIndex !== null) {
      const gp = gamepads[selectedGamepadIndex];
      // Lógica para vinculação de controles
    }
  };

  const clearBinding = (target: keyof GamepadBinding) => {
    setBinding((prev) => ({ ...prev, [target]: null }));
  };

  return (
    <div>
      <h1>Simulador de Controle</h1>

      <label htmlFor="gamepad-select">Selecione o controlador:</label>
      <select id="gamepad-select" onChange={(e) => setSelectedGamepadIndex(parseInt(e.target.value))}>
        <option value="">Selecione</option>
        {gamepads.map((gp, index) => (
          <option key={index} value={index}>
            {gp.id}
          </option>
        ))}
      </select>

      <div className="bindings">
        {['eixoX', 'acelerador', 'freio', 'marchaUp', 'marchaDown'].map((key) => (
          <div key={key} className="binding-item">
            <p>{key}</p>
            <input type="text" value={binding[key as keyof GamepadBinding] !== null ? `Vinculado` : 'Não vinculado'} readOnly />
            <button onClick={() => startBinding(key as keyof GamepadBinding)}>Vincular</button>
            <button onClick={() => clearBinding(key as keyof GamepadBinding)}>Desvincular</button>
          </div>
        ))}
      </div>

      <div className="volante-container">
        <p>Graus de giro: {state.grausVolante.toFixed(0)}°</p>
        <div className="volante" style={{ transform: `rotate(${state.grausVolante}deg)` }}></div>
      </div>

      <div className="control-bars">
        <div className="bar">
          <p>Acelerador</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${state.acelerador * 100}%` }}></div>
          </div>
        </div>
        <div className="bar">
          <p>Freio</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${state.freio * 100}%` }}></div>
          </div>
        </div>
        <div className="bar">
          <p>Marcha: {state.marcha}</p>
        </div>
      </div>
    </div>
  );
};

export default GameController;
