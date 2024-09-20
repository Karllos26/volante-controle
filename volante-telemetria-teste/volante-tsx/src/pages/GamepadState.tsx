import { useEffect, useState } from 'react';

export const useGamepadState = () => {
  const [gamepad, setGamepad] = useState<Gamepad | null>(null);
  const [buttonStates, setButtonStates] = useState<boolean[]>([]);
  const [axisStates, setAxisStates] = useState<number[]>([]);

  useEffect(() => {
    const updateGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0];
      if (gp) {
        setGamepad(gp);
        setButtonStates(gp.buttons.map(b => b.pressed));
        setAxisStates([...gp.axes]); // Copia dos eixos
      }
      requestAnimationFrame(updateGamepad);
    };

    updateGamepad();
  }, []);

  return { gamepad, buttonStates, axisStates };
};
