import { State } from '@/core/state';
import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from '@/core/draw-engine';
import { gameStateMachine } from '@/game-state-machine';
import startState from './start.state';
import { gameData } from '@/core/game-data';
import { controls } from '@/core/controls';

const menu: [string, number][] = [
  [' Story mode', 80],
  [' Endless mode', 160],
];

class LevelsState implements State {
  selectedButton = 0;

  onUpdate(_delta: number) {
    // title
    drawEngine.drawText({
      text: 'Levels',
      x: WIDTH / 2,
      y: 30,
      textAlign: 'center',
      color: colors.gray,
      size: 3,
    });

    const width = 16 + 5;
    const x = WIDTH / 2 - 4 * width;
    [
      ...menu,
      ['&', this.selectedButton === 0 ? menu[0][1] : menu[1][1]] as [string, number],
    ].forEach(([text, y]) => {
      drawEngine.drawText({
        text,
        x: x - 10,
        y,
        color: colors.black,
        size: 2,
      });
    });

    drawEngine.drawText({
      text: ` Hi score: ${gameData.highScore}`,
      x: x - 10,
      y: 175,
      color: colors.light,
      size: 2,
    });


    drawEngine.drawText({
      text: gameData.easyMode ? '# Easy Mode Enabled #' : 'Press E for easy mode',
      x: WIDTH / 2,
      y: HEIGHT - 35,
      textAlign: 'center',
      color: gameData.easyMode ? colors.gray : colors.light,
      size: 1,
    });

    drawEngine.drawText({
      text: 'Press ENTER to start',
      x: WIDTH / 2,
      y: HEIGHT - 20,
      textAlign: 'center',
      color: colors.gray,
      size: 1,
    });
  
    c.save();
    c.translate(x, 100);
    [IconKey.boss1, IconKey.boss2, IconKey.boss3, IconKey.boss4].forEach((boss, i) => {
      c.save();
      c.scale(2, 2);
      const pos = {x: width * i, y: 0};
      drawEngine.drawRect(pos, {x: 16, y: 16}, colors.light, colors.light);
      drawEngine.drawIcon(boss, pos, true);
      c.restore();
    });
    c.restore();

    if (controls.isKeyE && !controls.previousState.isKeyE) {
      gameData.easyMode = !gameData.easyMode;
    }
  }

  onUp() {
    this.selectedButton--;
    if (this.selectedButton < 0) {
      this.selectedButton = menu.length - 1;
    }
  }

  onDown() {
    this.selectedButton++;
    if (this.selectedButton > menu.length - 1) {
      this.selectedButton = 0;
    }
  }

  onConfirm() {
    if (this.selectedButton === 0) {
      gameData.endless = false;
      gameStateMachine.setState(startState);
    } else {
      gameData.endless = true;
      gameData.nextLevel();
    }
  }
}

export const levelsState = new LevelsState();
