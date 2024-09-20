import React, { useState } from 'react';
import { useGamepadState } from './GamepadState';
import WheelDisplay from './WheelDisplay';
import ButtonAxisSelector from './ButtonAxisSelector';

const ControlPanel: React.FC = () => {
  const { gamepad } = useGamepadState();
  const [selectedAxis, setSelectedAxis] = useState<number>(0);
  const [selectedButtons, setSelectedButtons] = useState({
    accelerator: 7,
    brake: 6,
    gearUp: 4,
    gearDown: 5,
  });

  const handleSelectionChange = (newSelection: any) => {
    setSelectedButtons(newSelection);
    setSelectedAxis(newSelection.axis);
  };

  return (
    <div>
      <h1>Control Panel</h1>
      {gamepad && (
        <div>
          <h2>Gamepad {gamepad.index}</h2>
          <WheelDisplay
            gamepad={gamepad}
            selectedAxis={selectedAxis}
            selectedButtons={selectedButtons}
          />
          <ButtonAxisSelector gamepad={gamepad} onSelectionChange={handleSelectionChange} />
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
