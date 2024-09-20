import React, { useState, useEffect } from 'react';
import wheelImage from '../assets/volante.png';

interface WheelDisplayProps {
  gamepad: Gamepad | null;
  selectedAxis: number;
  selectedButtons: {
    accelerator: number;
    brake: number;
    gearUp: number;
    gearDown: number;
  };
}

const WheelDisplay: React.FC<WheelDisplayProps> = ({ gamepad, selectedAxis, selectedButtons }) => {
  const [axisState, setAxisState] = useState<number>(0);
  const [buttonStates, setButtonStates] = useState<boolean[]>([]);

  useEffect(() => {
    const updateGamepadState = () => {
      if (gamepad) {
        const gp = navigator.getGamepads()[gamepad.index];
        if (gp) {
          setAxisState(gp.axes[selectedAxis] || 0);
          setButtonStates(gp.buttons.map(b => b.pressed));
        }
      }
      requestAnimationFrame(updateGamepadState);
    };
    updateGamepadState();
  }, [gamepad, selectedAxis]);

  return (
    <div>
      <h1>Wheel Display</h1>
      <div>
        <h3>Volante</h3>
        <img
          src={wheelImage}
          alt="Steering Wheel"
          style={{
            width: '150px',
            height: '150px',
            transform: `rotate(${axisState * 1080}deg)`,
          }}
        />
        <p>Rotação: {Math.round(axisState * 1080)}°</p>
      </div>
      <div>
        <h3>Acelerador e Freio</h3>
        <label>Acelerador: </label>
        <progress value={gamepad?.buttons[selectedButtons.accelerator]?.value ?? 0} max={1} />
        <br />
        <label>Freio: </label>
        <progress value={gamepad?.buttons[selectedButtons.brake]?.value ?? 0} max={1} />
      </div>
      <div>
        <h3>Marchas</h3>
        <div style={{ width: '20px', height: '20px', backgroundColor: buttonStates[selectedButtons.gearUp] ? 'red' : 'gray', display: 'inline-block' }} />
        <label>Marcha para cima</label>
        <div style={{ width: '20px', height: '20px', backgroundColor: buttonStates[selectedButtons.gearDown] ? 'red' : 'gray', display: 'inline-block' }} />
        <label>Marcha para baixo</label>
      </div>
      
    </div>
  );
};

export default WheelDisplay;
