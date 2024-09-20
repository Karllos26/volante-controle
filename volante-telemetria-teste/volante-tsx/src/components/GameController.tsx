import React, { useState, useEffect } from 'react';
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

  const [bindingTarget, setBindingTarget] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [availableButtons, setAvailableButtons] = useState<number[]>([]);
  const [availableAxes, setAvailableAxes] = useState<number[]>([]);
  const [state, setState] = useState({
    grausVolante: 0,
    acelerador: 0,
    freio: 0,
    marcha: 0,
  });

  // Atualiza os gamepads conectados
  useEffect(() => {
    const updateGamepads = () => {
      const connectedGamepads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) as Gamepad[] : [];
      setGamepads(connectedGamepads);
    };

    window.addEventListener('gamepadconnected', (event: GamepadEvent) => {
      console.log("A gamepad connected:", event.gamepad);
      updateGamepads();
    });

    window.addEventListener('gamepaddisconnected', (event: GamepadEvent) => {
      console.log("A gamepad disconnected:", event.gamepad);
      updateGamepads();
    });

    updateGamepads();

    return () => {
      window.removeEventListener('gamepadconnected', (event: GamepadEvent) => {
        console.log("A gamepad connected:", event.gamepad);
        updateGamepads();
      });
      window.removeEventListener('gamepaddisconnected', (event: GamepadEvent) => {
        console.log("A gamepad disconnected:", event.gamepad);
        updateGamepads();
      });
    };
  }, []);

  // Captura dados do controle
  useEffect(() => {
    const handleGamepadInput = () => {
      if (selectedGamepadIndex === null || !gamepads[selectedGamepadIndex]) return;
      const gp = gamepads[selectedGamepadIndex];

      const eixoXValue = binding.eixoX !== null ? gp.axes[binding.eixoX] || 0 : 0;
      const aceleradorValue = binding.acelerador !== null ? gp.buttons[binding.acelerador].value || 0 : 0;
      const freioValue = binding.freio !== null ? gp.buttons[binding.freio].value || 0 : 0;

      let grausVolante = eixoXValue * 900; // Ajuste para 900 graus
      grausVolante = Math.min(Math.max(grausVolante, -450), 450);

      const marcha = state.marcha;
      if (binding.marchaUp !== null && gp.buttons[binding.marchaUp]?.pressed) {
        setState((prev) => ({ ...prev, marcha: prev.marcha < 1 ? prev.marcha + 1 : 1 }));
      } else if (binding.marchaDown !== null && gp.buttons[binding.marchaDown]?.pressed) {
        setState((prev) => ({ ...prev, marcha: prev.marcha > -1 ? prev.marcha - 1 : -1 }));
      }

      setState({
        grausVolante,
        acelerador: aceleradorValue,
        freio: freioValue,
        marcha,
      });
    };

    const interval = setInterval(handleGamepadInput, 100);
    return () => clearInterval(interval);
  }, [binding, gamepads, selectedGamepadIndex, state.marcha]);

  // Inicia processo de vinculação
  const startBinding = (target: string) => {
    setBindingTarget(target);
    setIsSelecting(true);
    if (selectedGamepadIndex !== null && gamepads[selectedGamepadIndex]) {
      const gp = gamepads[selectedGamepadIndex];
      setAvailableButtons(gp.buttons.map((_, index) => index));
      setAvailableAxes(gp.axes.map((_, index) => index));
    }
  };

  // Finaliza processo de vinculação
  const finishBinding = (index: number, isAxis: boolean) => {
    setBinding((prev) => ({
      ...prev,
      [bindingTarget as string]: isAxis ? index : index,
    }));
    setIsSelecting(false);
    setBindingTarget(null);
  };

  const clearBinding = (target: string) => {
    setBinding((prev) => ({
      ...prev,
      [target]: null,
    }));
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
        <div className="binding-item">
          <p>Volante (Eixo X)</p>
          <input type="text" value={binding.eixoX !== null ? `Eixo ${binding.eixoX}` : 'Não vinculado'} readOnly />
          <button onClick={() => startBinding('eixoX')}>Vincular</button>
          <button onClick={() => clearBinding('eixoX')}>Desvincular</button>
        </div>
        <div className="binding-item">
          <p>Acelerador (RT)</p>
          <input type="text" value={binding.acelerador !== null ? `Botão ${binding.acelerador}` : 'Não vinculado'} readOnly />
          <button onClick={() => startBinding('acelerador')}>Vincular</button>
          <button onClick={() => clearBinding('acelerador')}>Desvincular</button>
        </div>
        <div className="binding-item">
          <p>Freio (LT)</p>
          <input type="text" value={binding.freio !== null ? `Botão ${binding.freio}` : 'Não vinculado'} readOnly />
          <button onClick={() => startBinding('freio')}>Vincular</button>
          <button onClick={() => clearBinding('freio')}>Desvincular</button>
        </div>
        <div className="binding-item">
          <p>Marcha ↑ (RB)</p>
          <input type="text" value={binding.marchaUp !== null ? `Botão ${binding.marchaUp}` : 'Não vinculado'} readOnly />
          <button onClick={() => startBinding('marchaUp')}>Vincular</button>
          <button onClick={() => clearBinding('marchaUp')}>Desvincular</button>
        </div>
        <div className="binding-item">
          <p>Marcha ↓ (LB)</p>
          <input type="text" value={binding.marchaDown !== null ? `Botão ${binding.marchaDown}` : 'Não vinculado'} readOnly />
          <button onClick={() => startBinding('marchaDown')}>Vincular</button>
          <button onClick={() => clearBinding('marchaDown')}>Desvincular</button>
        </div>
      </div>

      {isSelecting && (
        <div className="selection-popup">
          <h3>Selecione o botão ou eixo para vincular à função {bindingTarget}</h3>
          <div className="available-inputs">
            <div className="available-buttons">
              <h4>Botões</h4>
              {availableButtons.length > 0 ? (
                availableButtons.map((button) => (
                  <button key={button} onClick={() => finishBinding(button, false)}>Botão {button}</button>
                ))
              ) : (
                <p>Nenhum botão disponível.</p>
              )}
            </div>
            <div className="available-axes">
              <h4>Eixos</h4>
              {availableAxes.length > 0 ? (
                availableAxes.map((axis) => (
                  <button key={axis} onClick={() => finishBinding(axis, true)}>Eixo {axis}</button>
                ))
              ) : (
                <p>Nenhum eixo disponível.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="volante">
        <div className="volante-inner" style={{ transform: `rotate(${state.grausVolante}deg)` }} />
        <div className="volante-info">
          <p>Acelerador: {state.acelerador.toFixed(2)}</p>
          <p>Freio: {state.freio.toFixed(2)}</p>
          <p>Marcha: {state.marcha}</p>
        </div>
      </div>
    </div>
  );
};

export default GameController;