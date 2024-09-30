import { State } from '@/core/state';
import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from '@/core/draw-engine';
import { gameStateMachine } from '@/game-state-machine';
import startState from './start.state';
import { gameData } from '@/core/game-data';
import { controls } from '@/core/controls';
import cutsceneState from './cutscene.state';
import music from '@/core/music';

const menu: string[] = [
  'Story mode',
  'Restart story',
  'Endless mode',
];

class LevelsState implements State {
  selectedButton = 0;

  onEnter() {
    music.stop();
  }

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

    const width = 16;
    let x = WIDTH / 2 - 2 * width;
    let y = 0;
    const base = 130;
    [
      ...menu,
    ].forEach((text) => {
      drawEngine.drawText({
        text,
        x: x,
        y: base + (y++) * 12,
        color: colors.black,
        size: 1,
      });
    });
    drawEngine.drawText({
      text: '&',
      x: x - 10,
      y: base + this.selectedButton * 12,
      color: colors.black,
      size: 1,
    });

    drawEngine.drawText({
      text: `High score: ${gameData.highScore}`,
      x: x,
      y: base + (y++) * 12,
      color: colors.light,
      size: 1,
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
      y: HEIGHT - 15,
      textAlign: 'center',
      color: colors.gray,
      size: 1,
    });
  
    x = WIDTH / 2 - 4 * width;
    c.save();
    c.translate(x, 80);
    drawEngine.drawRect({x: -width, y: 0}, {x: width * 10, y: width*2}, colors.light, colors.light);
    [IconKey.boss1, IconKey.boss2, IconKey.boss3, IconKey.boss4].forEach((boss, i) => {
      c.save();
      c.scale(2, 2);
      const pos = {x: width * i, y: 0};
      drawEngine.drawIcon(boss, pos, gameData.boss <= i);
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
      gameStateMachine.setState(gameData.boss === 0 ? cutsceneState : startState);
    } else if (this.selectedButton === 1) {
      gameData.endless = false;
      gameData.boss = 0;
      gameStateMachine.setState(cutsceneState);
    } else {
      gameData.endless = true;
      gameData.start();
    }
  }
}

export const levelsState = new LevelsState();
