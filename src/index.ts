import { createGameStateMachine, gameStateMachine } from './game-state-machine';
import { controls } from '@/core/controls';
import { drawEngine } from './core/draw-engine';
import { updateTimeEvents } from './core/timer';
import { menuState } from './game-states/menu.state';
import { preLoadLevels as preLoadLevelsStrings } from './core/font';
import { gameData } from './core/game-data';

// @ts-ignore -- is not undefined for sure
document.querySelector('link[type="image/x-icon"]').href = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ctext y=\'.9em\' font-size=\'90\'%3E🎞%3C/text%3E%3C/svg%3E';


async function init() {
  await drawEngine.init();
  preLoadLevelsStrings();
}

let previousTime = 0;
let fpsBacklog: number[] = [];

function update(currentTime: number) {
  let delta = currentTime - previousTime;

  if (delta >= 16) {
    if (gameData.speedUp) {
      delta *= 1.3;
    }
    
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
      state.postRender && state.postRender(delta);
      updateTimeEvents(delta);
    // }
  }

  requestAnimationFrame(update);
};

init()
.then(() => {
  createGameStateMachine(menuState);
  requestAnimationFrame(update);
});
