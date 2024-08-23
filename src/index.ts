import { menuState } from './game-states/menu.state';
import { createGameStateMachine, gameStateMachine } from './game-state-machine';
import { controls } from '@/core/controls';
import { initAudio } from './core/audio';
import { drawEngine } from './core/draw-engine';
import { updateTimeEvents } from './core/timer';

// @ts-ignore -- is not undefined for sure
document.querySelector('link[type="image/x-icon"]').href = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E🎞%3C/text%3E%3C/svg%3E';

createGameStateMachine(menuState);

let previousTime = 0;
let fpsBacklog: number[] = [];
initAudio();

function draw(currentTime: number) {
  const delta = currentTime - previousTime;
  
  previousTime = currentTime;
  fpsBacklog.push(1000 / delta);
  if (fpsBacklog.length === 15) {
    fps.innerHTML = `${Math.round(fpsBacklog.reduce((a, b) => a + b) / 15)} FPS`;
    fpsBacklog = [];
  }

  // if (document.hasFocus()) {
    drawEngine.clear();
  
    const state = gameStateMachine.getState();
    controls.onUpdate(state);
    state.onUpdate(delta);
    updateTimeEvents(delta);
  // }
  requestAnimationFrame(draw);
};

requestAnimationFrame(draw);
