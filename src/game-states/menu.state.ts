import { State } from '@/core/state';
import { colors, drawEngine, HEIGHT, IconKey, WIDTH } from '@/core/draw-engine';
import { gameStateMachine } from '@/game-state-machine';
import { gameData, MAX_LIVES } from '@/core/game-data';
import { levelsState } from './levels.state';
import music from '@/core/music';
import aboutState from './about.state';
// import { musicPlayer } from '@/core/music';

const menu = [
  'start  ',
  'about  ',
];

class MenuState implements State {
  selectedButton = 0;
  showWarning = false;

  constructor() {
    document.addEventListener('click', () => this.showWarning = true);
  }

  onEnter() {
    music.stop();
  }

  onLeave() {
  }

  onUpdate(_delta: number) {
    ['THIRTEEN', 'TERRIBLE', 'STUNTS'].forEach(
      (text, i) => [colors.light, colors.black].forEach(
        (color, c) => drawEngine.drawText({
          text,
          x: WIDTH / 2 - c,
          y: 40 + i * 15 - c,
          textAlign: 'center',
          color,
          size: 2,
        })
      )
    );

    menu.forEach((text, i) => {
      drawEngine.drawText({
        text: (i === this.selectedButton ? '& ' : '  ') + text,
        x: WIDTH / 2,
        y: 120 + i * 16,
        textAlign: 'center',
        color: i === this.selectedButton ? colors.black : colors.gray,
        size: 1,
      });
    });

    if (this.showWarning) {
      [colors.light, colors.black].forEach((color, i) => {
        drawEngine.drawText({
          text: 'Use  Enter + WASD/Arrows  to play',
          x: WIDTH / 2,
          y: 100 - i,
          textAlign: 'center',
          color,
          size: 1,
        });
      });
    }

    c.save();
    c.globalAlpha = 0.5;
    c.translate(0.5, 0.5);
    c.rotate(-25);
    c.scale(8,8);
    drawEngine.drawIcon(IconKey.jumping, {x: 3, y: 13});
    c.restore();

    drawEngine.drawText({
      text: 'Press Enter to start',
      x: WIDTH / 2,
      y: HEIGHT - 15,
      textAlign: 'center',
      color: colors.gray,
      size: 1,
    });
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
      gameData.endless = true;
      gameData.level = -1;
      gameData.lives = MAX_LIVES;
      gameStateMachine.setState(levelsState);
    } else if (this.selectedButton === 1){
      gameStateMachine.setState(aboutState);
    }
  }
}

export const menuState = new MenuState();
