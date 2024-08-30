import { colors, drawEngine, easeInOutSine, HEIGHT, WIDTH } from '@/core/draw-engine';
import { BROKEN_HEART, HEART, preLoadStrings } from '@/core/font';
import { gameData } from '@/core/game-data';
import { State } from '@/core/state';
import { addTimeEvent } from '@/core/timer';
import { gameStateMachine } from '@/game-state-machine';
import { menuState } from '@/game-states/menu.state';
import { Vec2 } from '@/util/types';

const panelWidth = 200;
const panelHeight = 50;

export class GameBase implements State {
  velocity: Vec2 = {x: 0, y: 0};

  isStarting = false;
  isEnding = false;
  animationDuration = 500;
  animationTimer = 0;
  animationProgress = 0;
  maxTime = 10;
  timeLeft = 0;
  text = '';
  gameOver = false;

  onEnter() {
    this.timeLeft = this.maxTime;
    this.isStarting = false;
    this.isEnding = false;
    this.gameOver = false;
    this.start();
  }

  queryControls(_delta: number) {}

  stop() {
    this.velocity = {x: 0, y: 0};
  }

  start() {
    this.animationTimer = 0;
    this.isStarting = true;
  }

  getHearts(offset = 0) {
    return HEART.repeat(gameData.lives - offset) + BROKEN_HEART.repeat(3 - (gameData.lives - offset));
  }

  timeOver() {
    this.loseLife();
  }

  loseLife() {
    this.stop();
    const strBefore = `Oh no! ${this.getHearts()}`;
    const strAfter = `Oh no! ${this.getHearts(1)}`;
    const size = Math.floor(panelWidth / (6 * strBefore.length));
    preLoadStrings([strBefore, strAfter], [colors.black], size);
    this.text = strBefore;
    this.animationTimer = 0;
    this.isEnding = true;

    gameData.lives--;
    addTimeEvent(() => {
      this.text = strAfter;
    }, 200, 3, this.animationDuration);
    addTimeEvent(() => {
      this.text = strBefore;
    }, 200, 2, this.animationDuration + 100);

    if (gameData.lives < 1) {
      addTimeEvent(() => {
        this.gameOver = true;
        this.text = 'you\'re fired!';
      }, this.animationDuration * 4);
      addTimeEvent(() => {
        gameStateMachine.setState(menuState);
      }, this.animationDuration * 7);
    } else {
      addTimeEvent(() => {        
        this.onEnter();
      }, this.animationDuration * 4);
    }
  }

  nextLevel() {
    this.stop();
    this.animationTimer = 0;
    this.text = 'Nice!';
    this.isEnding = true;
    addTimeEvent(() => {
      gameData.nextLevel();
    }, this.animationDuration * 3);
  }

  onUpdate(delta: number) {
    if (!this.isEnding && !this.isStarting) {
      this.queryControls(delta);
      this.timeLeft = Math.max(0, this.timeLeft - delta / 1000);
      if (Math.round(this.timeLeft) <= 0) {
        this.timeOver();
      }
    }
  }

  postRender(delta: number) {
    if (this.isEnding || this.isStarting) {
      this.animationTimer += delta;
      if (this.animationTimer <= this.animationDuration) {
        this.animationProgress = easeInOutSine(this.animationTimer / this.animationDuration);
      }
      if (this.animationTimer > 0){
        this.renderPanel();
      }
      if (this.animationTimer > this.animationDuration * 2) {
        if (this.isStarting) {
          this.isStarting = false;
        }
      }
    }

    this.renderStats();
  }

  renderStats() {
    const stats: [string|number, CanvasTextAlign, number][] = [
      [this.getHearts(), 'left', 7],
      [Math.round(this.timeLeft), 'center', WIDTH / 2],
      [`Lvl ${gameData.level + 1}`, 'right', WIDTH - 7],
    ];
    stats.forEach(([text, textAlign, x]) => {
      [colors.light, colors.black].forEach((color, i) => {
        drawEngine.drawText({
          text: text.toString(),
          x: x - i,
          y: 7 - i,
          textAlign,
          color,
          size: 2,
        });
      });
    });
    const width = Math.round(50 * this.timeLeft / this.maxTime / 2) * 2;
    drawEngine.drawRect(
      {x: WIDTH/2 - width/2, y: 20},
      {x: width, y: 8},
      colors.black,
      colors.white,
    );
  }

  renderPanel() {
    const x = (WIDTH * this.animationProgress) - (WIDTH / 2);
    const y = (HEIGHT * this.animationProgress) - (HEIGHT / 2);
    const background = this.gameOver ? colors.black : colors.white;
    const foreground = this.gameOver ? colors.white : colors.black;
    // Shadow
    drawEngine.drawRect(
      {x: WIDTH - x - (panelWidth / 2) + 8, y: HEIGHT - y - (panelHeight / 2) + 8},
      {x: panelWidth, y: panelHeight},
      colors.black,
    );
    // Front
    drawEngine.drawRect(
      {x: x - (panelWidth / 2), y: y - (panelHeight / 2)},
      {x: panelWidth, y: panelHeight},
      colors.black,
      background,
    );
    // Text
    drawEngine.drawText({
      text: this.text,
      x: this.animationProgress * WIDTH / 2,
      y: this.animationProgress * (HEIGHT / 2),
      textAlign: 'center',
      textBaseline: 'middle',
      size: Math.floor(panelWidth / (6 * this.text.length)),
      color: foreground
    });
  }
}