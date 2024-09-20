import React, { useState } from 'react';

interface ButtonAxisSelectorProps {
  gamepad: Gamepad | null;
  onSelectionChange: (selected: { accelerator: number; brake: number; gearUp: number; gearDown: number; axis: number }) => void;
}

const ButtonAxisSelector: React.FC<ButtonAxisSelectorProps> = ({ gamepad, onSelectionChange }) => {
  const [axis, setAxis] = useState<number>(0);
  const [accelerator, setAccelerator] = useState<number>(7);
  const [brake, setBrake] = useState<number>(6);
  const [gearUp, setGearUp] = useState<number>(4);
  const [gearDown, setGearDown] = useState<number>(5);

  const handleSubmit = () => {
    onSelectionChange({ accelerator, brake, gearUp, gearDown, axis });
  };

  return (
    <div>
      <h3>Selecionar Botões e Eixos</h3>
      <div>
        <label>Eixo: </label>
        <select value={axis} onChange={(e) => setAxis(parseInt(e.target.value))}>
          {gamepad?.axes.map((_, index) => (
            <option key={index} value={index}>
              Eixo {index}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Acelerador: </label>
        <select value={accelerator} onChange={(e) => setAccelerator(parseInt(e.target.value))}>
          {gamepad?.buttons.map((_, index) => (
            <option key={index} value={index}>
              Botão {index}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Freio: </label>
        <select value={brake} onChange={(e) => setBrake(parseInt(e.target.value))}>
          {gamepad?.buttons.map((_, index) => (
            <option key={index} value={index}>
              Botão {index}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Marcha para cima: </label>
        <select value={gearUp} onChange={(e) => setGearUp(parseInt(e.target.value))}>
          {gamepad?.buttons.map((_, index) => (
            <option key={index} value={index}>
              Botão {index}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Marcha para baixo: </label>
        <select value={gearDown} onChange={(e) => setGearDown(parseInt(e.target.value))}>
          {gamepad?.buttons.map((_, index) => (
            <option key={index} value={index}>
              Botão {index}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit}>Confirmar Seleção</button>
    </div>
  );
};

export default ButtonAxisSelector;
